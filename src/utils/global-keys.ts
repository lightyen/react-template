import React, { useEffectEvent } from "react"
import { create } from "zustand"
import { mapEvtToKeycode } from "./key-event"

export enum KeyState {
	Initial,
	KeyDown,
	KeyUp,
}

interface GlobalKeyState {
	keys: { [P in string]: KeyState }
}

interface GlobalKeyAction {
	setKey(id: string, keyState: KeyState): void
	clear(): void
}

function init() {
	return create<GlobalKeyState & GlobalKeyAction>()(set => ({
		keys: {},
		setKey(id, keyState) {
			set(state => ({ ...state, keys: { ...state.keys, [id]: keyState } }))
		},
		clear() {
			set(state => ({ ...state, keys: {} }))
		},
	}))
}

function openDevTools(evt: KeyboardEvent) {
	return evt.ctrlKey && evt.shiftKey && evt.code === "KeyJ"
}

const store = init()

export function useGlobalKeys(enable: boolean) {
	const setKey = store(state => state.setKey)
	const clear = store(state => state.clear)
	const onkeydown = useEffectEvent((e: KeyboardEvent) => {
		if (openDevTools(e)) {
			return
		}

		e.preventDefault()

		if (!enable || e.repeat) {
			return
		}

		const id = mapEvtToKeycode(e)
		if (id === "") {
			return
		}

		const s = store.getState().keys[id]
		if (s !== KeyState.KeyDown) {
			setKey(id, KeyState.KeyDown)
		}
	})
	const onkeyup = useEffectEvent((e: KeyboardEvent) => {
		e.preventDefault()
		if (!enable || e.repeat) {
			return
		}

		const id = mapEvtToKeycode(e)
		if (id === "") {
			return
		}

		const s = store.getState().keys[id]
		if (s !== KeyState.KeyUp) {
			setKey(id, KeyState.KeyUp)
		}
	})
	React.useEffect(() => {
		if (enable) {
			window.addEventListener("keydown", onkeydown)
			window.addEventListener("keyup", onkeyup)
		}
		// Remove event listeners on cleanup
		return () => {
			window.removeEventListener("keydown", onkeydown)
			window.removeEventListener("keyup", onkeyup)
			clear()
		}
	}, [enable, clear])

	return store
}

export const useKeyStore = store
