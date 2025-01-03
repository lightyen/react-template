import type { Duration, FormatLongFn, FormatLongWidth } from "date-fns"
import { formatDistanceToNowStrict as $formatDistanceToNowStrict } from "date-fns/formatDistanceToNowStrict"
import { formatDuration as $formatDuration } from "date-fns/formatDuration"
import { formatWithOptions } from "date-fns/fp/formatWithOptions"

import { enUS, ja, zhTW } from "date-fns/locale"
const locales = {
	"en-US": enUS,
	"ja-JP": ja,
	"zh-TW": zhTW,
}

import { getLocale } from "./lib"

interface BuildFormatLongFnArgs<DefaultMatchWidth extends FormatLongWidth> {
	formats: Partial<{ [format in FormatLongWidth]: string }> & {
		[format in DefaultMatchWidth]: string
	}
	defaultWidth: DefaultMatchWidth
}

export function buildFormatLongFn<DefaultMatchWidth extends FormatLongWidth>(
	args: BuildFormatLongFnArgs<DefaultMatchWidth>,
): FormatLongFn {
	return (options = {}) => {
		const width = options.width ? (String(options.width) as FormatLongWidth) : args.defaultWidth
		const format = args.formats[width] ?? args.formats[args.defaultWidth]
		return format
	}
}

if (zhTW.formatLong) {
	// XXX: Change date format
	// zhTW.formatLong.date = buildFormatLongFn({
	// 	formats: {
	// 		full: "y'年'M'月'd'日' EEEE",
	// 		long: "y'年'M'月'd'日'",
	// 		medium: "yyyy/MM/dd",
	// 		short: "y/MM/dd",
	// 	},
	// 	defaultWidth: "full",
	// })
}

export const format = (date: Date, formatStr: string) => {
	const [locale] = getLocale()
	return formatWithOptions({
		locale: locales[locale],
	})(formatStr)(date)
}

export function getDateFnsLocale() {
	const [locale] = getLocale()
	const [primary] = locale.toLocaleLowerCase().split(/-/)
	switch (primary) {
		case "en":
			return enUS
		case "zh":
			return zhTW
		case "ja":
			return ja
		default:
			return enUS
	}
}

export function formatDistanceToNowStrict(
	date: number | Date,
	{ locale, ...rest }: Parameters<typeof $formatDistanceToNowStrict>[1] = {},
) {
	return $formatDistanceToNowStrict(date, {
		...rest,
		locale: locale ?? getDateFnsLocale(),
	})
}

export function getDuration(duration: number): Duration {
	const r: Duration = { years: 0, days: 0, hours: 0, minutes: 0, seconds: 0 }
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

export function formatDuration(
	duration: Duration | number,
	{ locale, ...rest }: Parameters<typeof $formatDuration>[1] = {},
) {
	if (typeof duration === "number") {
		duration = getDuration(duration)
	}
	return $formatDuration(duration, {
		...rest,
		locale: locale ?? getDateFnsLocale(),
		format: ["years", "months", "days", "hours", "minutes", "seconds"],
	})
}
