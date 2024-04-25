import { PropsWithChildren, createContext, useContext, useMemo, useState } from "react"

interface DialogProps {
	visible: boolean
	setVisible(v: boolean | ((prev: boolean) => boolean)): void
}

interface DialogState {
	visible: boolean
}

interface DialogContext extends DialogState {
	setVisible(v: boolean | ((prev: boolean) => boolean)): void
}

const dialogContext = createContext<DialogContext>(null as unknown as DialogContext)

function useDialog(initialState: boolean | (() => boolean) = false) {
	const [visible, setVisible] = useState(initialState)
	return { visible, setVisible }
}

export function Dialog({ visible, setVisible }: PropsWithChildren<DialogProps>) {
	const ctx = useMemo(() => {
		return { visible, setVisible }
	}, [visible, setVisible])

	return (
		<dialogContext.Provider value={ctx}>
			<Other />
			<View />
		</dialogContext.Provider>
	)
}

function Other() {
	console.log("other")
	return null
}

function View() {
	const { visible } = useContext(dialogContext)
	console.log("view")
	return String(visible)
}

export function ContextTest() {
	const diag = useDialog()
	console.log("ContextTest")
	return (
		<div>
			<button
				type="button"
				onClick={() => {
					diag.setVisible(v => !v)
				}}
			>
				Button
			</button>
			<Dialog {...diag}></Dialog>
		</div>
	)
}
