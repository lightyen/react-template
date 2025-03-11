import { createReducer } from "@reduxjs/toolkit"
import * as d from "date-fns"
import { enUS, ja, zhTW } from "date-fns/locale"
import { createIntl, createIntlCache, IntlCache, type IntlShape } from "react-intl"
import * as ac from "./action"
import { getLocale, locales, LocaleType, storeLocale } from "./lib"

interface IntlStoreType {
	locale: string
	intlShape: IntlShape
	dateFns: DateFns
	dateLocale: d.Locale
}

export type IntlStore = Readonly<IntlStoreType>

const [locale, messages] = getLocale()

function createIntlShape(config: { locale: LocaleType; messages: Record<string, string> }, cache?: IntlCache) {
	return createIntl(
		{
			defaultLocale: "en-US",
			timeZone: undefined,
			fallbackOnEmptyString: true,
			formats: {},
			defaultFormats: {},
			...config,
		},
		cache,
	)
}

const dateLocales = {
	"en-US": enUS,
	"ja-JP": ja,
	"zh-TW": zhTW,
}

// XXX: Change date format
if (zhTW.formatLong) {
	interface BuildFormatLongFnArgs<DefaultMatchWidth extends d.FormatLongWidth> {
		formats: Partial<{ [format in d.FormatLongWidth]: string }> & {
			[format in DefaultMatchWidth]: string
		}
		defaultWidth: DefaultMatchWidth
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	function buildFormatLongFn<DefaultMatchWidth extends d.FormatLongWidth>(
		args: BuildFormatLongFnArgs<DefaultMatchWidth>,
	): d.FormatLongFn {
		return (options = {}) => {
			const width = options.width ? (String(options.width) as d.FormatLongWidth) : args.defaultWidth
			const format = args.formats[width] ?? args.formats[args.defaultWidth]
			return format
		}
	}

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

type DateValue = Date | number | string

type OmitLocale<T> = Omit<T, "locale">

interface DateFns {
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

function buildDateFns(locale: d.Locale): DateFns {
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
			return this.formatDistance(date, d.constructNow(date), options)
		},
		formatDistanceToNowStrict(date, options) {
			return this.formatDistanceStrict(date, d.constructNow(date), options)
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

const intlCache = createIntlCache()

const init: IntlStore = {
	locale: locale,
	intlShape: createIntlShape({ locale, messages }, intlCache),
	dateLocale: dateLocales[locale],
	dateFns: buildDateFns(dateLocales[locale]),
}

export const intl = createReducer(init, builder =>
	builder.addCase(ac.setLocale, (state, { payload: locale }) => {
		if (locale in locales) {
			storeLocale(locale)
			const [loc, messages] = getLocale()
			state.locale = loc
			state.intlShape = createIntlShape({ locale: loc, messages }, intlCache)
			state.dateLocale = dateLocales[locale]
			state.dateFns = buildDateFns(dateLocales[locale])
		} else {
			throw new Error(`resource "${locale}" is not found.`)
		}
	}),
)
