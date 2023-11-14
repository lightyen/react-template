import { mediaQueryEvents } from "@context/events"
import { fork, put, takeEvery } from "redux-saga/effects"
import * as ac from "./action"
import { toast } from "./toast"

export default function* data() {
	yield fork(toast)
	yield takeEvery(mediaQueryEvents("(pointer: coarse)"), function* (event) {
		yield put(ac.ismobile(event.matches))
	})
}
