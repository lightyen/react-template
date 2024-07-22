import type { Duration, FormatLongFn, FormatLongWidth } from "date-fns"
import { formatDistanceToNowStrict as __formatDistanceToNowStrict } from "date-fns/formatDistanceToNowStrict"
import { formatDuration as __formatDuration } from "date-fns/formatDuration"
import { formatWithOptions } from "date-fns/fp/formatWithOptions"

import { enUS, ja, zhTW } from "date-fns/locale"
const locales = {
	"en-US": enUS,
	"ja-JP": ja,
	"zh-TW": zhTW,
}

import { getLocale } from "./common"

export function setLocale(_locale: string) {
	//
}

interface BuildFormatLongFnArgs<DefaultMatchWidth extends FormatLongWidth> {
	formats: Partial<{ [format in FormatLongWidth]: string }> & {
		[format in DefaultMatchWidth]: string
	}
	defaultWidth: DefaultMatchWidth
}

function buildFormatLongFn<DefaultMatchWidth extends FormatLongWidth>(
	args: BuildFormatLongFnArgs<DefaultMatchWidth>,
): FormatLongFn {
	return (options = {}) => {
		const width = options.width ? (String(options.width) as FormatLongWidth) : args.defaultWidth
		const format = args.formats[width] || args.formats[args.defaultWidth]
		return format
	}
}

if (zhTW.formatLong) {
	zhTW.formatLong.date = buildFormatLongFn({
		formats: {
			full: "y'年'M'月'd'日' EEEE",
			long: "y'年'M'月'd'日'",
			medium: "yyyy/MM/dd",
			short: "y/MM/dd",
		},
		defaultWidth: "full",
	})
}

export const format = (date: Date, formatStr: string) => {
	const [locale] = getLocale()
	return formatWithOptions({
		locale: locales[locale],
	})(formatStr)(date)
}

export function getDateLocale() {
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
	{ locale, ...rest }: Parameters<typeof __formatDistanceToNowStrict>[1] = {},
) {
	return __formatDistanceToNowStrict(date, {
		...rest,
		locale: locale ?? getDateLocale(),
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
	{ locale, ...rest }: Parameters<typeof __formatDuration>[1] = {},
) {
	if (typeof duration === "number") {
		duration = getDuration(duration)
	}

	format
	return __formatDuration(duration, {
		...rest,
		locale: locale ?? getDateLocale(),
		format: ["years", "months", "days", "hours", "minutes", "seconds"],
	})
}
