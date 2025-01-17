import { createContext } from "react"

export interface DialogState {
	visible: boolean
	lightDismiss: boolean
}

export interface DialogContext extends DialogState {
	setVisible(v: boolean | ((prev: boolean) => boolean)): void
}

export const DialogContext = createContext<DialogContext>({} as DialogContext)
