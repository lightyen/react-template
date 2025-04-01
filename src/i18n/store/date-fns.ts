import * as d from "date-fns"

type DateValue = Date | number | string
type OmitLocale<T> = Omit<T, "locale">

export interface DateFns {
	format(date: DateValue, formatStr: string, options?: OmitLocale<d.FormatOptions>): string
	formatRelative(
		date: string | number | Date,
		baseDate: string | number | Date,
		options?: OmitLocale<d.FormatRelativeOptions>,
	): string
	formatDistance(laterDate: DateValue, earlierDate: DateValue, options?: OmitLocale<d.FormatDistanceOptions>): string
	formatDistanceStrict(
		laterDate: DateValue,
		earlierDate: DateValue,
		options?: OmitLocale<d.FormatDistanceStrictOptions>,
	): string
	formatDistanceToNow(date: DateValue, options?: OmitLocale<d.FormatDistanceToNowOptions>): string
	formatDistanceToNowStrict(date: DateValue, options?: OmitLocale<d.FormatDistanceToNowStrictOptions>): string
	formatDuration(duration: number | d.Duration, options?: OmitLocale<d.FormatDurationOptions>): string
}

export function buildDateFns(locale: d.Locale): DateFns {
	return {
		format(date, formatStr, options) {
			return d.format(date, formatStr, { ...options, locale })
		},
		formatRelative(date, baseDate, options) {
			return d.formatRelative(date, baseDate, { ...options, locale })
		},
		formatDistance(laterDate, earlierDate, options) {
			return d.formatDistance(laterDate, earlierDate, { ...options, locale })
		},
		formatDistanceStrict(laterDate, earlierDate, options) {
			return d.formatDistanceStrict(laterDate, earlierDate, { ...options, locale })
		},
		formatDistanceToNow(date, options) {
			// NOTE: 'this' is undefined.
			return d.formatDistance(date, d.constructNow(date), { ...options, locale })
		},
		formatDistanceToNowStrict(date, options) {
			return d.formatDistanceStrict(date, d.constructNow(date), { ...options, locale })
		},
		formatDuration(duration, options) {
			if (typeof duration === "number") {
				duration = convertDuration(duration)
			}
			return d.formatDuration(duration, {
				...options,
				locale,
				format: ["years", "months", "days", "hours", "minutes", "seconds"],
			})
		},
	}
}

function convertDuration(duration: number): d.Duration {
	const r: d.Duration = { years: 0, days: 0, hours: 0, minutes: 0, seconds: 0 }
	r.years = Math.floor(duration / 31536000)
	duration %= 31536000
	r.days = Math.floor(duration / 86400)
	duration %= 86400
	r.hours = Math.floor(duration / 3600)
	duration %= 3600
	r.minutes = Math.floor(duration / 60)
	duration %= 60
	r.seconds = duration
	return r
}
