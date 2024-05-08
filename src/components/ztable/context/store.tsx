/* eslint-disable @typescript-eslint/no-explicit-any */
import { PropsWithChildren, createContext, useContext } from "react"
import { create } from "zustand"
import { immer } from "zustand/middleware/immer"
import { defaultSearchFunction } from "./defaultSearch"
import type { FilterState, TableColumnItem, TableOptions, TableStore, WithIndex } from "./model"

export const defaultLimitOptions = [10, 20, 30, 40, 50]

export const TableContext = createContext(null as unknown as ReturnType<typeof createStore<any>>)

export function Provider<T extends {}>({ children, ...options }: PropsWithChildren<TableOptions<T>>) {
	return <TableContext.Provider value={createStore(options)}>{children}</TableContext.Provider>
}

export function useTableStore() {
	return useContext(TableContext)
}

export function createStore<T extends {}>({
	source,
	columns: _columns = [],
	limitOptions = defaultLimitOptions,
	limit = 10,
}: TableOptions<T>) {
	return create<TableStore<T>>()(
		immer(set => {
			const columns = _columns.map<TableColumnItem<T>>(column => ({
				...column,
				selected: column.defaultSelected ?? true,
				canSelected: column.canSelected ?? true,
				sortType: column.defaultSortType ?? "",
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
				reset(source) {
					set(state => {
						state.source = source as any[]
						state.items = source.map(() => ({ checked: false }))
						update(state, false)
					})
				},
				globalCheckbox(checked) {
					set(state => {
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
				},
				checkbox(checked, index) {
					set(state => {
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
				},
				toggleColumn(columnIndex) {
					set(state => {
						const column = state.columns[columnIndex]
						column.selected = !column.selected
					})
				},
				toggleFilter(columnIndex) {
					set(state => {
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
				},
				setGlobalSearch(value) {
					set(state => {
						state.global.value = typeof value === "function" ? value(state.global.value) : value
						update(state)
					})
				},
				clearFilter(columnIndex) {
					set(state => {
						const column = state.columns[columnIndex]
						const f = state.filters[column.id]
						f.value = ""
						f.options = []
						update(state)
					})
				},
				setFilter(columnIndex, value) {
					set(state => {
						const column = state.columns[columnIndex]
						const f = state.filters[column.id]
						f.value = value
						update(state)
					})
				},
				toggleFilterOption(columnIndex, option) {
					set(state => {
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
				},
				sortColumn(columnIndex, type) {
					set(state => {
						const column = state.columns[columnIndex]
						if (column.sortType === type) {
							return
						}

						column.sortType = type

						for (let i = 0; i < state.columns.length; i++) {
							if (i !== columnIndex) {
								const column = state.columns[i]
								column.sortType = ""
							}
						}

						state.pagination.pageIndex = 0
						updateSort(state)
					})
				},
				setPageIndex(payload) {
					set(state => {
						const pageIndex = typeof payload === "function" ? payload(state.pagination.pageIndex) : payload
						if (state.pagination.pageIndex === pageIndex) {
							return
						}
						state.pagination.pageIndex = pageIndex
						updatePagination(state)
					})
				},
				prev() {
					set(state => {
						state.pagination.pageIndex--
						updatePagination(state)
					})
				},
				next() {
					set(state => {
						state.pagination.pageIndex++
						updatePagination(state)
					})
				},
				first() {
					set(state => {
						state.pagination.pageIndex = 0
						updatePagination(state)
					})
				},
				last() {
					set(state => {
						state.pagination.pageIndex = Math.ceil(state.filtered.length / state.pagination.limit) - 1
						updatePagination(state)
					})
				},
				to(pageIndex) {
					set(state => {
						if (state.pagination.pageIndex === pageIndex || state.filtered.length === 0) {
							return
						}

						if (pageIndex === 0) {
							state.pagination.pageIndex = 0
						} else {
							const offsetPage = pageIndex - state.pagination.pageIndex
							state.pagination.pageIndex += offsetPage
						}

						updatePagination(state)
					})
				},
				setLimit(limit) {
					set(state => {
						if (state.pagination.limit === limit) {
							return
						}
						state.pagination.limit = limit
						updatePagination(state)
					})
				},
			}
		}),
	)

	function update(state: TableStore<any>, resetPage = true) {
		const { filtered, checkList } = filter(state.source, state.columns, state.filters, state.global.value)
		state.filtered = filtered
		state.global.checkList = checkList
		updateSort(state, resetPage)
	}

	function updateSort(state: TableStore<any>, resetPage = true) {
		if (resetPage) {
			state.pagination.pageIndex = 0
		}
		state.sorted = sort(state.filtered, state.columns)
		updatePagination(state)
	}

	function updatePagination(state: TableStore<any>) {
		const offset = state.pagination.pageIndex * state.pagination.limit
		state.view = state.sorted.slice(offset, offset + state.pagination.limit)
		state.pagination.pages = Math.ceil(state.filtered.length / state.pagination.limit)
		state.pagination.notPrev = state.filtered.length === 0 || state.pagination.pageIndex === 0
		state.pagination.notNext =
			state.filtered.length === 0 || state.pagination.pageIndex === state.pagination.pages - 1
	}

	function filter(
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

		const checkList: boolean[] = new Array(source.length).fill(true)

		let filtered: WithIndex<T>[] = source.map<WithIndex<T>>((src, i) => ({ ...src, rowIndex: i }))

		if (globalSearch) {
			const match = defaultSearchFunction(globalSearch)
			filtered = filtered.filter((record, rowIndex) => {
				for (const value of Object.values(record)) {
					if (match(String(value))) {
						return true
					}
				}
				checkList[rowIndex] = false
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
					filtered = filtered.filter((record, rowIndex) => {
						if (filter(record, value, defaultSearch) === ans) {
							return true
						}
						checkList[rowIndex] = false
						return false
					})
				} else if (filter instanceof Array) {
					for (const opt of options) {
						filtered = filtered.filter((record, rowIndex) => {
							if (opt.filter(record) === ans) {
								return true
							}
							checkList[rowIndex] = false
							return false
						})
					}
				}
			}
		}

		if (oneOf.length > 0) {
			filtered = filtered.filter((record, rowIndex) => {
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
				checkList[rowIndex] = false
				return false
			})
		}

		return { checkList, filtered }
	}

	function sort(source: WithIndex<T>[], columns: TableColumnItem<T>[]) {
		const s = source.slice()
		for (const column of columns) {
			if (!column.sortType) {
				continue
			}
			if (column.compare != null) {
				const comp = column.compare
				if (column.sortType === "asc") {
					s.sort(comp)
				} else {
					s.sort((a, b) => comp(b, a))
				}
				return s
			}
		}
		return source
	}
}
