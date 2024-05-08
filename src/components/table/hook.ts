import { TableContext, createStore, type TableOptions } from "./context/store"

export function useTable<T extends {}>(options: TableOptions<T>) {
	const context = TableContext
	const store = createStore(options)
	return { context, store }
}
