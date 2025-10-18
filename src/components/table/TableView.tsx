import { ArrowDownIcon, ArrowUpIcon, CaretSortIcon } from "@radix-ui/react-icons"
import Mark from "mark.js"
import { useEffect, useRef } from "react"
import { useTableStore } from "."
import { Button } from "../button"
import { Command, CommandItem, CommandList } from "../command"
import { isReactNode } from "../lib"
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "../popover"
import type { Label, SortType, TableColumnItem, WithIndex } from "./context/model"

function SortButton({
	sortType,
	onSort = () => void 0,
	children,
}: React.PropsWithChildren<{ sortType?: SortType; onSort?(t: SortType): void }>) {
	return (
		<Popover>
			<PopoverTrigger>
				<Button variant="ghost" size="sm" tw="relative -ml-3">
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
							<CommandItem onSelect={() => onSort("")} tw="flex gap-2">
								<CaretSortIcon />
								<span tw="pointer-events-none capitalize">Default</span>
							</CommandItem>
							<CommandItem onSelect={() => onSort("asc")} tw="flex gap-2">
								<ArrowUpIcon />
								<span tw="pointer-events-none capitalize">Asc</span>
							</CommandItem>
							<CommandItem onSelect={() => onSort("desc")} tw="flex gap-2">
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

function TableWrapper({
	ref,
	children,
	...props
}: React.TableHTMLAttributes<HTMLTableElement> & { ref?: React.Ref<HTMLTableElement> }) {
	return (
		<div aria-label="table-view" tw="rounded-md border overflow-x-auto">
			<div tw="relative w-full">
				<table ref={ref} tw="w-full caption-bottom text-sm whitespace-nowrap" {...props}>
					{children}
				</table>
			</div>
		</div>
	)
}

function ThLabel({ Label }: { Label: Label }) {
	const useSelect = useTableStore()
	const checked = useSelect(state => state.global.checked)
	const intermediate = useSelect(state => state.global.intermediate)
	const globalCheckbox = useSelect(state => state.globalCheckbox)
	if (isReactNode(Label)) {
		return Label
	}
	return <Label checked={checked} intermediate={intermediate} onChecked={checked => globalCheckbox(checked)} />
}

function Row<T>({ data, columns }: { data: WithIndex<T>; columns: TableColumnItem<T>[] }) {
	const useSelect = useTableStore()
	const checked = useSelect(state => state.items[data.dataIndex].checked)
	const checkbox = useSelect(state => state.checkbox)
	return (
		<tr
			tw="border-b transition-colors duration-100 hover:bg-muted/50 data-[state=selected]:bg-muted"
			className="group"
			data-state={checked ? "selected" : undefined}
		>
			{columns.map(({ Component, id, selected }, colIndex) => {
				if (!selected) {
					return null
				}
				return (
					<td
						tw="p-2 first-of-type:pl-4 align-middle leading-none [&:has([role=checkbox])]:pr-2"
						key={colIndex}
						className={`col-${id}`}
					>
						{Component ? (
							<Component
								record={data}
								checked={checked}
								onChecked={checked => checkbox(checked, data.dataIndex)}
							/>
						) : (
							id && data[id]
						)}
					</td>
				)
			})}
		</tr>
	)
}

interface Props<T> {
	keyFn?: (record: T) => React.Key
}

function useMark<T>(result: T[], columns: TableColumnItem<T>[]) {
	const useSelect = useTableStore()
	const globalValue = useSelect(state => state.global.value)
	const filters = useSelect(state => state.filters)

	interface ColumnMark {
		id: string
		mark?: Mark
		nth: number
	}

	const arr = useRef<ColumnMark[]>([])

	useEffect(() => {
		let nth = 1
		arr.current = columns.map(({ id, selected }) => {
			if (id === "checkbox" || !selected) {
				return { id, nth: -1 }
			}
			const el = document.querySelectorAll<HTMLElement>(`#table-view tr td:nth-of-type(${nth + 1})`)
			let mark: Mark | undefined
			if (el) {
				mark = new Mark(el)
			}
			nth++
			return { id, mark, nth }
		})

		const marks = arr.current

		marks.forEach(({ id, mark }) => {
			if (mark) {
				const f = filters[id]
				if (f && typeof f.value === "string" && f.value) {
					mark.mark(f.value)
				}
				if (globalValue) {
					mark.mark(globalValue)
				}
			}
		})

		return () => {
			marks.forEach(({ mark }) => {
				if (mark) {
					mark.unmark()
				}
			})
		}
	}, [result, columns, filters, globalValue])
}

export function TableView<T extends {} = {}>({
	children,
	keyFn,
	...props
}: React.PropsWithChildren<React.TableHTMLAttributes<HTMLTableElement> & Props<T>>) {
	const useSelect = useTableStore()
	const limit = useSelect(state => state.pagination.limit)
	const columns = useSelect(state => state.columns)
	const colSpan = columns.reduce((cnt, column) => (column.selected ? cnt + 1 : cnt), 0)
	const result = useSelect(state => state.view)
	const hasHeader = columns.some(c => c.label)
	const sortColumn = useSelect(state => state.sortColumn)

	useMark<T>(result, columns)

	return (
		<TableWrapper {...props}>
			{hasHeader && (
				<thead tw="[& tr]:border-b">
					<tr tw="border-b transition-colors duration-100 hover:bg-muted/50 data-[state=selected]:bg-muted">
						{columns.map(
							({ selected, label, compare, sortType, className, style: _style }, columnIndex) => {
								if (!selected) {
									return null
								}
								return (
									<th
										key={columnIndex}
										tw="h-10 px-2 first-of-type:pl-4 text-left align-middle leading-none font-medium text-muted-foreground [&:has([role=checkbox])]:pr-2"
										style={_style}
										className={className}
									>
										{compare ? (
											<SortButton sortType={sortType} onSort={t => sortColumn(columnIndex, t)}>
												<ThLabel Label={label} />
											</SortButton>
										) : (
											<ThLabel Label={label} />
										)}
									</th>
								)
							},
						)}
					</tr>
				</thead>
			)}
			<tbody id="table-view" tw="[& tr:last-of-type]:border-0 [mark]:(text-primary-foreground bg-primary)">
				{result.map((data, i) => {
					return data ? (
						<Row key={keyFn ? (keyFn(data) ?? i) : i} data={data} columns={columns} />
					) : (
						<tr
							key={keyFn ? (keyFn(data) ?? i) : i}
							tw="border-b transition-colors duration-100 hover:bg-muted/50 data-[state=selected]:bg-muted"
						>
							<td
								tw="p-2 first-of-type:pl-4 align-middle [&:has([role=checkbox])]:pr-2"
								colSpan={colSpan}
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
								colSpan={colSpan}
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
