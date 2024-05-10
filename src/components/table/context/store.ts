import { Reducer, bindActionCreators, configureStore } from "@reduxjs/toolkit"
import { createContext } from "react"
import {
	ReactReduxContextValue,
	TypedUseSelectorHook,
	createDispatchHook,
	createSelectorHook,
	createStoreHook,
} from "react-redux"
import * as actions from "./action"
import type { SortType, TableBaseColumn, TableStore } from "./model"
import { create, reducer } from "./reducer"

interface UseTableColumnItem<T extends {} = {}> extends TableBaseColumn<T> {
	/** @default true */
	selected?: boolean
	/** @default true */
	canSelected?: boolean
	/** @default "" */
	sortType?: SortType
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

export function createStore<T extends {}>(options: TableOptions<T>) {
	return configureStore({
		reducer: reducer as Reducer,
		preloadedState: create(options),
	})
}

export const TableContext = createContext<ReactReduxContextValue<Readonly<TableStore<{}>>> | null>(null)
export const useSelect: TypedUseSelectorHook<Readonly<TableStore<{}>>> = createSelectorHook(TableContext)
export const useStore = createStoreHook(TableContext)
export const useDispatch = createDispatchHook(TableContext)

export function useAction() {
	const dispatch = useDispatch()
	return bindActionCreators(actions, dispatch)
}
