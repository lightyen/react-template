import { type Locale as DateLocale } from "date-fns"
import { enUS, ja, zhTW } from "date-fns/locale"
import qs from "qs"
import { createIntl, createIntlCache, IntlCache, type IntlShape } from "react-intl"
import { buildDateFns, type DateFns } from "./date-fns"

import $enUS from "../locales/en-US.yml"
import $jaJP from "../locales/ja-JP.yml"
import $zhTW from "../locales/zh-TW.yml"

export const defaultLocale = "en-US"

export const locales = {
	"en-US": "English",
	"ja-JP": "日本語",
	"zh-TW": "正體中文",
}

export type LocaleType = keyof typeof locales

function qs_get(name: string): string | null {
	const o = qs.parse(window.location.search.replace(/^\?/, ""))
	if (!Object.prototype.hasOwnProperty.call(o, name)) {
		return null
	}
	return o[name]
}

function firstExistString(...args: (string | null | undefined)[]): string {
	for (const v of args) {
		if (v) {
			return v
		}
	}
	return ""
}

let cache: { locale: LocaleType; messages: Record<string, string> }

function getLocale(): { locale: LocaleType; messages: Record<string, string> } {
	if (cache) {
		return cache
	}

	const locale = firstExistString(
		qs_get("lang"),
		localStorage.getItem("locale"),
		window.navigator.language,
		defaultLocale,
	)

	const [primary] = locale.toLocaleLowerCase().split(/-/)
	switch (primary) {
		case "zh":
			document.documentElement.lang = primary
			cache = { locale: "zh-TW", messages: $zhTW }
			break
		case "ja":
			document.documentElement.lang = primary
			cache = { locale: "ja-JP", messages: $jaJP }
			break
		default:
			document.documentElement.lang = "en"
			cache = { locale: "en-US", messages: $enUS }
			break
	}
	return cache
}

function storeLocale(locale: string) {
	localStorage.setItem("locale", locale)
	const [primary] = locale.toLocaleLowerCase().split(/-/)
	document.documentElement.lang = primary
	switch (primary) {
		case "zh":
			cache = { locale: "zh-TW", messages: $zhTW }
			break
		case "ja":
			cache = { locale: "ja-JP", messages: $jaJP }
			break
		default:
			cache = { locale: "en-US", messages: $enUS }
			break
	}
}

export interface Snapshot {
	locale: LocaleType
	locales: Record<LocaleType, string>
	dateLocale: DateLocale
	intl: IntlShape
	dateFns: DateFns
	setLocale(locale: string): void
}

interface ReactExternalStore<S> {
	subscribe(onStoreChange: () => void): () => void
	getSnapshot(): S
	getServerSnapshot?(): S
}

function createStore(): ReactExternalStore<Snapshot> {
	const listeners: Array<() => void> = []
	const dateLocales: Record<LocaleType, DateLocale> = {
		"en-US": enUS,
		"ja-JP": ja,
		"zh-TW": zhTW,
	}

	const intlCache = createIntlCache()
	const o = getLocale()

	let state: Snapshot = {
		locale: o.locale,
		intl: createIntlShape({ locale: o.locale, messages: o.messages }, intlCache),
		dateFns: buildDateFns(dateLocales[o.locale]),
		dateLocale: dateLocales[o.locale],
		locales,
		setLocale: changeLanguage,
	}

	return {
		subscribe(onStoreChange: () => void) {
			listeners.push(onStoreChange)
			return () => {
				listeners.filter(v => v !== onStoreChange)
			}
		},
		getSnapshot(): Snapshot {
			return state
		},
	}

	function createIntlShape(config: { locale: LocaleType; messages: Record<string, string> }, cache?: IntlCache) {
		return createIntl(
			{
				defaultLocale,
				timeZone: undefined,
				fallbackOnEmptyString: true,
				formats: {},
				defaultFormats: {},
				...config,
			},
			cache,
		)
	}

	function changeLanguage(loc: string) {
		storeLocale(loc)

		const { locale, messages } = getLocale()

		state = {
			...state,
			locale,
			intl: createIntlShape({ locale, messages }, intlCache),
			dateFns: buildDateFns(dateLocales[locale]),
			dateLocale: dateLocales[locale],
		}

		for (const listener of listeners) {
			listener()
		}
	}
}

export const store = createStore()
