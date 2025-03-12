import { configureStore, Tuple } from "@reduxjs/toolkit"
import createSagaMiddleware from "redux-saga"
import { app, type AppStore } from "./app/reducer"
import { data, type DataStore } from "./data/reducer"
import rootSaga from "./saga"

interface RootStoreType {
	app: AppStore
	data: DataStore
}

export type RootStore = Readonly<RootStoreType>

export function createStore() {
	const sagaMiddleware = createSagaMiddleware()
	const store = configureStore({
		reducer: {
			app,
			data,
		},
		middleware: () => new Tuple(sagaMiddleware),
		devTools: import.meta.env.MODE === "development" ? { name: import.meta.env.VITE_APP_NAME } : false,
	})

	sagaMiddleware.run(rootSaga)
	return store
}

export const store = createStore()
