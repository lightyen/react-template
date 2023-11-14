import { eventChannel, type EventChannel } from "redux-saga"

export function windowEvents(type: keyof WindowEventMap): EventChannel<Event>
export function windowEvents(type: string): EventChannel<Event>
export function windowEvents(type: string | keyof WindowEventMap): EventChannel<Event> {
	return eventChannel<Event>(emit => {
		function listener(e: Event) {
			e.preventDefault = () => void 0
			emit(e)
		}
		window.addEventListener(type, listener, { passive: true })
		return () => {
			window.removeEventListener(type, listener)
		}
	})
}

export const mediaQueryEvents = (query: string) =>
	eventChannel<MediaQueryListEvent>(emit => {
		const mql = window.matchMedia(query)
		function onchange(e: MediaQueryListEvent) {
			e.preventDefault = () => void 0
			emit(e)
		}
		mql.addEventListener("change", onchange, { passive: true })
		return () => {
			mql.removeEventListener("change", onchange)
		}
	})

export const sseEvents = (source: EventSource, event: string) =>
	eventChannel<MessageEvent>(emit => {
		function cb(e: MessageEvent) {
			emit(e)
		}
		source.addEventListener(event, cb, { passive: true })
		return () => {
			source.removeEventListener(event, cb)
		}
	})
