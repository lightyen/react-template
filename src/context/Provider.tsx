import { Provider as ReactReduxProvider } from "react-redux"
import { AppStoreContext } from "./hooks"
import { store } from "./store"

export function StoreProvider({ children }: React.PropsWithChildren<{}>) {
	return (
		<ReactReduxProvider context={AppStoreContext} store={store}>
			{children}
		</ReactReduxProvider>
	)
}
