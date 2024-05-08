import { type ComponentType } from "@react-spring/web"
import { type ReactElement } from "react"

export type SortType = "" | "asc" | "desc"

export type WithIndex<T> = T & { rowIndex: number }

export interface FilterInput<TData extends {} = {}> {
	(record: TData, value: string, defaultSearch: (record: string, value: string) => boolean): boolean
}

export interface FilterSelectOptions<T extends {} = {}> {
	label: string
	filter(record: T): boolean
}

interface GlobalLabelProps {
	checked: boolean
	onChecked(checked: boolean): void
	intermediate: boolean
}

interface LabelProps {
	checked: boolean
	onChecked(checked: boolean): void
}

export type Label = string | ReactElement | ComponentType<GlobalLabelProps>

export interface TableBaseColumn<T extends {} = {}> {
	id: string
	label: Label
	Component?: ComponentType<{ row: T } & LabelProps>
	className?: string
	style?: unknown
	compare?(a: T, b: T): number
	filter?: FilterInput<T> | FilterSelectOptions<T>[]
}

export interface TableColumnItem<T extends {} = {}> extends TableBaseColumn<T> {
	oneOf: boolean
	selected: boolean
	canSelected: boolean
	sortType: SortType
}

export interface FilterState<T extends {} = {}> {
	columnIndex: number
	oneOf: boolean
	not: boolean
	value: string
	options: FilterSelectOptions<T>[]
}

interface Global {
	checked: boolean
	intermediate: boolean
	value: string
	checkList: boolean[]
}

interface CheckboxItem {
	checked: boolean
}

interface Pagination {
	/** base index 0 */
	pageIndex: number
	/** @default 10 */
	limit: number
	limitOptions: number[]
	pages: number
	notPrev: boolean
	notNext: boolean
}

interface UseTableColumnItem<T extends {} = {}> extends TableBaseColumn<T> {
	/** @default true */
	defaultSelected?: boolean
	/** @default true */
	canSelected?: boolean
	/** @default "" */
	defaultSortType?: SortType
}

export interface TableDataOptions<T extends {}> {
	columns: UseTableColumnItem<T>[]
	/** default limit value
	 *  @default 10
	 */
	limit?: number

	/** @default '[10, 20, 30, 40, 50]' */
	limitOptions?: number[]
}

export interface TableOptions<T extends {}> extends TableDataOptions<T> {
	source: T[]
}

export interface TableStore<T extends {}> {
	columns: TableColumnItem<T>[]
	filters: Record<string, FilterState<T>>
	items: CheckboxItem[]
	global: Global
	pagination: Pagination
	source: T[]
	filtered: WithIndex<T>[]
	sorted: WithIndex<T>[]
	view: WithIndex<T>[]

	reset(source: T[]): void
	globalCheckbox(checked: boolean): void
	checkbox(checked: boolean, index: number): void
	setGlobalSearch(value: string | ((prev: string) => string)): void
	toggleColumn(columnIndex: number): void
	toggleFilter(columnIndex: number): void
	clearFilter(columnIndex: number): void
	setFilter(columnIndex: number, value: string): void
	toggleFilterOption(columnIndex: number, option: FilterSelectOptions<T>): void
	sortColumn(columnIndex: number, type: SortType): void
	setPageIndex(pageIndex: number | ((prev: number) => number)): void
	prev(): void
	next(): void
	first(): void
	last(): void
	to(pageIndex: number): void
	setLimit(limit: number): void
}
