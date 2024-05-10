/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ComponentType, ReactElement } from "react"

export type SortType = "" | "asc" | "desc"

export type WithIndex<T> = T & { dataIndex: number }

export interface FilterInput<T> {
	(record: T, value: string, defaultSearch: (record: string, value: string) => boolean): boolean
}

export interface FilterSelectOptions<T> {
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

export interface TableBaseColumn<T> {
	id: string
	label: Label
	Component?: ComponentType<{ record: T } & LabelProps>
	className?: string
	style?: unknown
	compare?(a: T, b: T): number
	filter?: FilterInput<T> | FilterSelectOptions<T>[]
}

export interface TableColumnItem<T = unknown> extends TableBaseColumn<T> {
	oneOf: boolean
	selected: boolean
	canSelected: boolean
	sortType: SortType
}

export interface FilterState<T> {
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

export interface TableStore<T = any> {
	columns: TableColumnItem<T>[]
	filters: Record<string, FilterState<T>>
	items: CheckboxItem[]
	global: Global
	pagination: Pagination
	source: T[]
	filtered: T[]
	sorted: T[]
	view: WithIndex<T>[]
}
