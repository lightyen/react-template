import { createReducer } from "@reduxjs/toolkit"
import * as ac from "./action"
import { defaultSearchFunction } from "./defaultSearch"
import type { FilterState, TableColumnItem, TableStore, WithIndex } from "./model"
import { TableOptions } from "./store"

const defaultLimitOptions = [10, 20, 30, 40, 50]

function filter<T extends {}>(
	source: T[],
	columns: TableColumnItem<T>[],
	filters: Record<string, FilterState<T>>,
	globalSearch: string,
) {
	const oneOf: FilterState<T>[] = []

	let fs = Object.values(filters).filter(f => {
		const column = columns[f.columnIndex]
		if (column.filter == null) {
			return false
		}
		if (typeof column.filter === "function") {
			return f.value != ""
		}
		return f.options.length > 0
	})

	fs = fs.filter(f => {
		if (f.oneOf) {
			oneOf.push(f)
			return false
		}
		return true
	})

	const checkList = new Array(source.length).fill(true)

	let filtered = source.map<WithIndex<T>>((src, i) => ({ ...src, dataIndex: i }))

	if (globalSearch) {
		const match = defaultSearchFunction(globalSearch)
		filtered = filtered.filter(record => {
			for (const value of Object.values(record)) {
				if (match(String(value))) {
					return true
				}
			}
			checkList[record.dataIndex] = false
			return false
		})
	}

	if (fs.length > 0) {
		for (const { not, columnIndex, value: v, options } of fs) {
			const value = v.trim()
			const filter = columns[columnIndex].filter
			const ans = !not
			const defaultSearch = defaultSearchFunction(value)
			if (typeof filter === "function") {
				filtered = filtered.filter(record => {
					if (filter(record, value, defaultSearch) === ans) {
						return true
					}
					checkList[record.dataIndex] = false
					return false
				})
			} else if (filter instanceof Array) {
				for (const opt of options) {
					filtered = filtered.filter(record => {
						if (opt.filter(record) === ans) {
							return true
						}
						checkList[record.dataIndex] = false
						return false
					})
				}
			}
		}
	}

	if (oneOf.length > 0) {
		filtered = filtered.filter(record => {
			for (const { not, columnIndex, value, options } of oneOf) {
				const filter = columns[columnIndex].filter
				const ans = !not
				const defaultSearch = defaultSearchFunction(value)
				if (typeof filter === "function") {
					if (filter(record, value, defaultSearch) === ans) {
						return true
					}
				} else if (filter instanceof Array) {
					for (const opt of options) {
						if (opt.filter(record) === ans) {
							return true
						}
					}
				}
			}
			checkList[record.dataIndex] = false
			return false
		})
	}

	return { checkList, filtered }
}

function sort<T extends {}>(source: WithIndex<T>[], columns: TableColumnItem<T>[]) {
	const s = source.slice()
	for (const col of columns) {
		if (!col.sortType) {
			continue
		}
		if (col.compare != null) {
			const comp = col.compare
			if (col.sortType === "asc") {
				s.sort(comp)
			} else {
				s.sort((a, b) => comp(b, a))
			}
			return s
		}
	}
	return source
}

function update(state: TableStore<never>) {
	const { filtered, checkList } = filter(state.source, state.columns, state.filters, state.global.value)
	state.filtered = filtered
	state.global.checkList = checkList
	updateSort(state)
}

function updateSort(state: TableStore<never>) {
	state.pagination.pageIndex = 0
	state.sorted = sort(state.filtered, state.columns)
	updatePagination(state)
}

function updatePagination(state: TableStore<never>) {
	const offset = state.pagination.pageIndex * state.pagination.limit
	state.view = state.sorted.slice(offset, offset + state.pagination.limit)
	state.pagination.pages = Math.ceil(state.filtered.length / state.pagination.limit)
	state.pagination.notPrev = state.filtered.length === 0 || state.pagination.pageIndex === 0
	state.pagination.notNext = state.filtered.length === 0 || state.pagination.pageIndex === state.pagination.pages - 1
}

export const reducer = createReducer(create({ source: [], columns: [] }), builder =>
	builder
		.addCase(ac.globalCheckbox, (state, { payload: checked }) => {
			const items = state.items

			let cnt = 0
			for (let i = 0; i < items.length; i++) {
				if (state.global.checkList[i]) {
					items[i].checked = checked
					if (checked) {
						cnt++
					}
				}
			}

			state.global.checked = checked
			state.global.intermediate = cnt > 0 && cnt !== items.length
		})
		.addCase(ac.checkbox, (state, { payload: { checked, index } }) => {
			state.items[index].checked = checked

			state.global.intermediate = false
			state.global.checked = checked

			const first = state.items[0].checked

			for (const { checked } of state.items) {
				if (first !== checked) {
					state.global.intermediate = true
					state.global.checked = true
					break
				}
			}
		})
		.addCase(ac.toggleColumn, (state, { payload: { id } }) => {
			const col = state.columns.find(v => v.id === id)
			if (col) {
				col.selected = !col.selected
			}
		})
		.addCase(ac.toggleFilter, (state, { payload: { columnIndex } }) => {
			const column = state.columns[columnIndex]
			const f = state.filters[column.id]
			if (f) {
				delete state.filters[column.id]
				update(state)
				return
			}

			state.filters[column.id] = {
				columnIndex: columnIndex,
				value: "",
				options: [],
				oneOf: column.oneOf,
				not: false,
			}
		})
		.addCase(ac.setGlobalSearch, (state, { payload }) => {
			const value = typeof payload === "function" ? payload(state.global.value) : payload
			state.global.value = value
			update(state)
		})
		.addCase(ac.clearFilter, (state, { payload: { columnIndex } }) => {
			const column = state.columns[columnIndex]
			const f = state.filters[column.id]
			f.value = ""
			f.options = []
			update(state)
		})
		.addCase(ac.setFilter, (state, { payload: { columnIndex, value } }) => {
			const column = state.columns[columnIndex]
			const f = state.filters[column.id]
			f.value = value
			update(state)
		})
		.addCase(ac.toggleFilterOption, (state, { payload: { columnIndex, option } }) => {
			const column = state.columns[columnIndex]
			const f = state.filters[column.id]
			const s = new Set(f.options.map(o => o.label))
			if (s.has(option.label)) {
				f.options.splice(
					f.options.findIndex(o => o.label === option.label),
					1,
				)
			} else {
				f.options.push(option)
			}
			update(state)
		})
		.addCase(ac.sortColumn, (state, { payload: { id, type } }) => {
			const column = state.columns.find(v => v.id === id)
			if (column && column.sortType === type) {
				return
			}
			for (const column of state.columns) {
				if (column.id === id) {
					column.sortType = type
					continue
				}
				column.sortType = ""
			}

			state.pagination.pageIndex = 0
			updateSort(state)
		})
		.addCase(ac.setPageIndex, (state, { payload }) => {
			const pageIndex = typeof payload === "function" ? payload(state.pagination.pageIndex) : payload
			if (state.pagination.pageIndex === pageIndex) {
				return
			}
			state.pagination.pageIndex = pageIndex
			updatePagination(state)
		})
		.addCase(ac.prev, state => {
			state.pagination.pageIndex--
			updatePagination(state)
		})
		.addCase(ac.next, state => {
			state.pagination.pageIndex++
			updatePagination(state)
		})
		.addCase(ac.first, state => {
			state.pagination.pageIndex = 0
			updatePagination(state)
		})
		.addCase(ac.last, state => {
			state.pagination.pageIndex = Math.ceil(state.filtered.length / state.pagination.limit) - 1
			updatePagination(state)
		})
		.addCase(ac.to, (state, { payload }) => {
			if (state.pagination.pageIndex === payload || state.filtered.length === 0) {
				return
			}

			if (payload === 0) {
				state.pagination.pageIndex = 0
			} else {
				const offsetPage = payload - state.pagination.pageIndex
				state.pagination.pageIndex += offsetPage
			}

			updatePagination(state)
		})
		.addCase(ac.setLimit, (state, { payload }) => {
			if (state.pagination.limit === payload) {
				return
			}
			state.pagination.limit = payload
			updatePagination(state)
		}),
)

export function create<T extends {}>({
	source,
	columns: _columns = [],
	limitOptions = defaultLimitOptions,
	limit = 10,
}: TableOptions<T>): TableStore<T> {
	const columns = _columns.map<TableColumnItem<T>>(column => ({
		...column,
		selected: column.selected ?? true,
		canSelected: column.canSelected ?? true,
		sortType: column.sortType ?? "",
		oneOf: column.filter && column.filter instanceof Array ? true : false,
	}))

	const { filtered, checkList } = filter(source, columns, {}, "")

	const sorted = sort(filtered, columns)
	const view = sorted.slice(0, limit)

	const pageIndex = 0

	const pages = Math.ceil(filtered.length / limit)
	const notPrev = source.length === 0 || pageIndex === 0
	const notNext = source.length === 0 || pageIndex === pages - 1

	return {
		columns,
		filters: {},
		items: source.map(() => ({ checked: false })),
		pagination: {
			pageIndex,
			limit,
			limitOptions: limitOptions,
			pages,
			notPrev,
			notNext,
		},
		global: {
			checked: false,
			intermediate: false,
			value: "",
			checkList,
		},
		source,
		filtered,
		sorted,
		view,
	}
}
