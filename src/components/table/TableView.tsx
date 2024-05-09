import { ArrowDownIcon, ArrowUpIcon, CaretSortIcon } from "@radix-ui/react-icons"
import { forwardRef, memo, type ForwardedRef, type PropsWithChildren, type TableHTMLAttributes } from "react"
import { Button } from "../button"
import { Command, CommandItem, CommandList } from "../command"
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "../popover"
import type { Label, SortType, TableColumnItem, WithIndex } from "./context/model"
import { useAction, useSelect } from "./context/store"

function SortButton({
	sortType,
	onSort,
	children,
}: PropsWithChildren<{ sortType?: SortType; onSort?(t: SortType): void }>) {
	return (
		<Popover>
			<PopoverTrigger>
				<Button variant="ghost" size="sm" tw="relative -ml-3 h-8">
					{children}
					{sortType === "desc" ? (
						<ArrowDownIcon tw="ml-2 h-4 w-4" />
					) : sortType === "asc" ? (
						<ArrowUpIcon tw="ml-2 h-4 w-4" />
					) : (
						<CaretSortIcon tw="ml-2 h-4 w-4" />
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent>
				<Command tw="w-32 p-1">
					<PopoverClose>
						<CommandList>
							<CommandItem onSelect={() => onSort?.("")} tw="flex gap-2">
								<CaretSortIcon />
								<span tw="pointer-events-none capitalize">Default</span>
							</CommandItem>
							<CommandItem onSelect={() => onSort?.("asc")} tw="flex gap-2">
								<ArrowUpIcon />
								<span tw="pointer-events-none capitalize">Asc</span>
							</CommandItem>
							<CommandItem onSelect={() => onSort?.("desc")} tw="flex gap-2">
								<ArrowDownIcon />
								<span tw="pointer-events-none capitalize">Desc</span>
							</CommandItem>
						</CommandList>
					</PopoverClose>
				</Command>
			</PopoverContent>
		</Popover>
	)
}

const TableWrapper = memo(
	forwardRef(function TableWrapper(
		{ children, ...props }: TableHTMLAttributes<HTMLTableElement>,
		ref: ForwardedRef<HTMLTableElement>,
	) {
		return (
			<div aria-label="table-view" tw="rounded-md border overflow-x-auto">
				<div tw="relative w-full">
					<table ref={ref} tw="w-full caption-bottom text-sm whitespace-nowrap" {...props}>
						{children}
					</table>
				</div>
			</div>
		)
	}),
)

function ThLabel({ Label }: { Label: Label }) {
	const checked = useSelect(state => state.global.checked)
	const intermediate = useSelect(state => state.global.intermediate)
	const { globalCheckbox } = useAction()
	if (typeof Label === "string") {
		return Label
	}
	if (typeof Label !== "function") {
		return Label
	}
	return <Label checked={checked} intermediate={intermediate} onChecked={checked => globalCheckbox(checked)} />
}

function Row({ row, columns }: { row: WithIndex<{}>; columns: TableColumnItem[] }) {
	const checked = useSelect(state => state.items[row.rowIndex].checked)
	const { checkbox } = useAction()
	return (
		<tr
			tw="border-b transition-colors duration-100 hover:bg-muted/50 data-[state=selected]:bg-muted"
			data-state={checked ? "selected" : undefined}
		>
			{columns.map(({ Component, id }, colIndex) => {
				return (
					<td tw="p-2 first-of-type:pl-4 align-middle [&:has([role=checkbox])]:pr-2" key={colIndex}>
						{Component ? (
							<Component
								row={row}
								checked={checked}
								onChecked={checked => checkbox(checked, row.rowIndex)}
							/>
						) : (
							id && row[id]
						)}
					</td>
				)
			})}
		</tr>
	)
}

export function TableView({ children, ...props }: PropsWithChildren<TableHTMLAttributes<HTMLTableElement>>) {
	const limit = useSelect(state => state.pagination.limit)
	const columns = useSelect(state => state.columns).filter(c => c.selected)
	const total = useSelect(state => state.source.length)
	const result = useSelect(state => state.view)
	const hasHeader = columns.some(c => c.label)
	const { sortColumn } = useAction()
	return (
		<TableWrapper {...props}>
			{hasHeader && (
				<thead tw="[& tr]:border-b">
					<tr tw="border-b transition-colors duration-100 hover:bg-muted/50 data-[state=selected]:bg-muted">
						{columns.map(({ id, label, compare, sortType, className, style: _style }, i) => {
							return (
								<th
									tw="h-10 px-2 first-of-type:pl-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-2"
									css={_style}
									className={className}
									key={i}
								>
									{compare ? (
										<SortButton sortType={sortType} onSort={t => sortColumn(id, t)}>
											<ThLabel Label={label} />
										</SortButton>
									) : (
										<ThLabel Label={label} />
									)}
								</th>
							)
						})}
					</tr>
				</thead>
			)}
			<tbody tw="[& tr:last-of-type]:border-0">
				{result.map((row, i) => {
					return row ? (
						<Row key={i} row={row} columns={columns} />
					) : (
						<tr
							key={i}
							tw="border-b transition-colors duration-100 hover:bg-muted/50 data-[state=selected]:bg-muted"
						>
							<td
								tw="p-2 first-of-type:pl-4 align-middle [&:has([role=checkbox])]:pr-2"
								colSpan={columns.length}
							>
								&nbsp;
							</td>
						</tr>
					)
				})}
				{(() => {
					if (limit === 0) {
						return null
					}
					return Array.from(Array(limit - result.length)).map((_, i) => (
						<tr
							tw="border-b transition-colors duration-100 hover:bg-muted/50 data-[state=selected]:bg-muted"
							key={i}
						>
							<td
								tw="p-2 first-of-type:pl-4 align-middle [&:has([role=checkbox])]:pr-2"
								colSpan={columns.length}
							>
								&nbsp;
							</td>
						</tr>
					))
				})()}
			</tbody>
		</TableWrapper>
	)
}
