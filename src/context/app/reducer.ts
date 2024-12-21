import { createReducer } from "@reduxjs/toolkit"
import { isMobile } from "~/components/internal/utils"
import * as ac from "./action"

export interface AppStore {
	mobile: boolean
	toasts: Record<string, ac.InnerToasterToast>
}

const init: AppStore = {
	mobile: isMobile(),
	toasts: {},
}

export const app = createReducer(init, builder =>
	builder
		.addCase(ac.ismobile, (state, { payload }) => {
			state.mobile = payload
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
