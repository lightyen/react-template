import { createContext } from "react"

export interface DialogState {
	visible: boolean
	/** Hide the popover by clicking outside it or pressing the `Esc` key. */
	lightDismiss: boolean
}

export interface DialogContext extends DialogState {
	setVisible(v: boolean | ((prev: boolean) => boolean)): void
}

export const DialogContext = createContext<DialogContext>({} as DialogContext)
