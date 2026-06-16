import { createContext } from "react"
import { create, type StoreApi, type UseBoundStore } from "zustand"

export interface DialogOptions {
	visible?: boolean
}

interface DialogState {
	visible: boolean
}

interface DialogAction {
	setVisible(visible: boolean | ((prevVisible: boolean) => boolean)): void
}

export type DialogStore = UseBoundStore<StoreApi<DialogAction & DialogState>>
export const DialogContext = createContext(null as unknown as DialogStore)

export function createDialogStore(options: DialogOptions = {}): DialogStore {
	return create<DialogAction & DialogState>()(set => ({
		visible: options.visible ?? false,
		setVisible(visible) {
			if (typeof visible === "function") {
				set(state => ({ ...state, visible: visible(state.visible) }))
			} else {
				set(state => ({ ...state, visible }))
			}
		},
	}))
}
