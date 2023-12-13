import { eyeDropper } from "@components/lib/colors"
import { mediaQueryEvents } from "@context/events"
import { call, fork, put, takeEvery } from "redux-saga/effects"
import * as ac from "./action"
import { toast } from "./toast"

export default function* data() {
	yield fork(toast)
	yield takeEvery(mediaQueryEvents("(pointer: coarse)"), function* (event) {
		yield put(ac.ismobile(event.matches))
	})
	yield takeEvery(ac.openEyeDropper, function* ({ payload: { id } }) {
		try {
			if (eyeDropper == null) {
				console.warn("EyeDropper is not supported.")
				return
			}
			const result: ColorSelectionResult = yield call(() => eyeDropper?.open())
			yield put(ac.eyeDropperResult(id, result))
		} catch {}
	})
}
