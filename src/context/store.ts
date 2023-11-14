import { configureStore } from "@reduxjs/toolkit"
import createSagaMiddleware from "redux-saga"
import { app, AppStore } from "./app/reducer"
import { data, DataStore } from "./data/reducer"
import { intl, IntlStore } from "./intl/reducer"
import rootSaga from "./saga"

interface RootStoreType {
	app: AppStore
	data: DataStore
	intl: IntlStore
}

export type RootStore = Readonly<RootStoreType>

export function createStore() {
	const sagaMiddleware = createSagaMiddleware()
	const store = configureStore({
		reducer: {
			app,
			data,
			intl,
		},
		middleware: [sagaMiddleware],
		devTools: import.meta.env.MODE === "development" ? { name: import.meta.env.VITE_APP_NAME } : false,
	})

	sagaMiddleware.run(rootSaga)
	return store
}

export const store = createStore()
