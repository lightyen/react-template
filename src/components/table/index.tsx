import { useContext, useRef } from "react"
import { TablePagination } from "./TablePagination"
import { TableToolbar } from "./TableToolbar"
import { TableView } from "./TableView"
import { TableOptions } from "./context/model"
import { TableContext, createStore } from "./context/store"

export { TablePagination } from "./TablePagination"
export { TableToolbar } from "./TableToolbar"
export { TableView } from "./TableView"

export function useTable<T extends {}>(options: TableOptions<T>) {
	const ref = useRef<ReturnType<typeof createStore<T>>>(undefined)
	if (!ref.current) {
		ref.current = createStore(options)
	}
	return ref.current
}

export function Provider<T extends {}>({
	children,
	store,
}: React.PropsWithChildren<{ store: ReturnType<typeof useTable<T>> }>) {
	return <TableContext value={store}>{children}</TableContext>
}

export function useTableStore() {
	return useContext(TableContext)
}

export function ZTable<T extends {}>({ children, ...options }: React.PropsWithChildren<TableOptions<T>>) {
	const store = useTable(options)
	return (
		<Provider<T> store={store}>
			<TableToolbar />
			<TableView />
			<TablePagination />
		</Provider>
	)
}
