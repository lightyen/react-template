import { DurationFormat } from "@formatjs/intl-durationformat/src/core"
import { DurationFormatOptions, type DurationInput } from "@formatjs/intl-durationformat/src/types"
import dayjs from "dayjs"

function durationInput(sec: number): DurationInput {
	sec = Math.floor(sec)
	const r: DurationInput = { years: 0, days: 0, hours: 0, minutes: 0, seconds: 0 }
	r.years = Math.floor(sec / 31536000)
	sec %= 31536000
	r.days = Math.floor(sec / 86400)
	sec %= 86400
	r.hours = Math.floor(sec / 3600)
	sec %= 3600
	r.minutes = Math.floor(sec / 60)
	sec %= 60
	r.seconds = sec
	return r
}

function normalize(r: DurationInput): DurationInput {
	let sec = 0
	if (r.years) sec += r.years * 31536000
	if (r.days) sec += r.days * 86400
	if (r.hours) sec += r.hours * 3600
	if (r.minutes) sec += r.minutes * 60
	if (r.seconds) sec += r.seconds
	return durationInput(sec)
}

export function formatDuration(_unix: number | DurationInput, options?: DurationFormatOptions): string {
	if (typeof _unix === "number") {
		_unix = durationInput(dayjs().diff(dayjs.unix(_unix), "seconds"))
	} else {
		_unix = normalize(_unix)
	}
	return new DurationFormat(window.__locale__, options).format(_unix)
}
