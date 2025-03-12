import { store, type Snapshot } from "./store/store"
import { useSyncExternalStoreWithSelector } from "./use-sync-external-store-with-selector"

export function useIntl<Selection>(selector: (s: Snapshot) => Selection) {
	return useSyncExternalStoreWithSelector(store.subscribe, store.getSnapshot, null, selector)
}
