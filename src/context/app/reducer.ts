import { isMobile } from "@components/lib"
import { createReducer } from "@reduxjs/toolkit"
import * as ac from "./action"

export interface AppStore {
	mobile: boolean
	toasts: Record<string, ac.InnerToasterToast>
	eyeDropperResult: Record<string, string>
}

const init: AppStore = {
	mobile: isMobile(),
	toasts: {},
	eyeDropperResult: {},
}

export const app = createReducer(init, builder =>
	builder
		.addCase(ac.ismobile, (state, { payload }) => {
			state.mobile = payload
		})
		.addCase(ac.eyeDropperResult, (state, { payload: { id, result } }) => {
			state.eyeDropperResult[id] = result.sRGBHex
		})
		.addCase(ac.removeAllToast, state => {
			state.toasts = {}
		})
		.addCase(ac.dismissToast, (state, { payload: id }) => {
			delete state.toasts[id]
		})
		.addMatcher(ac.isAddToastAction, (state, { payload: toast }) => {
			const t = state.toasts[toast.id]
			if (!t) {
				state.toasts[toast.id] = { ...toast, visible: true }
			}
		}),
)
