import { createAction } from "@reduxjs/toolkit"
import type { FilterSelectOptions, SortType } from "./model"

const globalCheckbox = createAction<boolean>("globalCheckbox")
const checkbox = createAction("checkbox", (checked: boolean, index: number) => ({ payload: { checked, index } }))
const setGlobalSearch = createAction("setGlobalSearch", (payload: string | ((prev: string) => string)) => ({
	payload,
}))
const toggleColumn = createAction("toggleColumn", (id: string) => ({ payload: { id } }))
const toggleFilter = createAction("toggleFilter", (columnIndex: number) => ({ payload: { columnIndex } }))
const clearFilter = createAction("clearFilter", (columnIndex: number) => ({ payload: { columnIndex } }))
const setFilter = createAction("setFilter", (columnIndex: number, value: string) => ({
	payload: { columnIndex, value },
}))
const toggleFilterOption = createAction(
	"toggleFilterOption",
	(columnIndex: number, option: FilterSelectOptions<unknown>) => ({
		payload: { columnIndex, option },
	}),
)
const sortColumn = createAction("sortColumn", (id: string, type: SortType) => ({ payload: { id, type } }))
const setPageIndex = createAction("pageIndex", (payload: number | ((prev: number) => number)) => ({ payload }))
const prev = createAction("prev", () => ({ payload: undefined }))
const next = createAction("next", () => ({ payload: undefined }))
const first = createAction("first", () => ({ payload: undefined }))
const last = createAction("last", () => ({ payload: undefined }))
const to = createAction("to", (payload: number) => ({ payload }))
const setLimit = createAction("setLimit", (payload: number) => ({ payload }))

export {
	checkbox,
	clearFilter,
	first,
	globalCheckbox,
	last,
	next,
	prev,
	setFilter,
	setGlobalSearch,
	setLimit,
	setPageIndex,
	sortColumn,
	to,
	toggleColumn,
	toggleFilter,
	toggleFilterOption,
}
