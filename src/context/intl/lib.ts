import qs from "qs"
import $enUS from "./locales/en-US.yml"
import $jaJP from "./locales/ja-JP.yml"
import $zhTW from "./locales/zh-TW.yml"

const defaultLocale = "en-US"

const locales = {
	"en-US": "English",
	"ja-JP": "日本語",
	"zh-TW": "正體中文",
}

export { $enUS, $jaJP, $zhTW, defaultLocale, locales }

export type LocaleType = keyof typeof locales

let current: [LocaleType, Record<string, string>]

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

export function getLocale(): [LocaleType, Record<string, string>] {
	if (current) {
		return current
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
			current = ["zh-TW", $zhTW]
			break
		case "ja":
			document.documentElement.lang = primary
			current = ["ja-JP", $jaJP]
			break
		default:
			document.documentElement.lang = "en"
			current = ["en-US", $enUS]
			break
	}
	return current
}

export function storeLocale(locale: string) {
	localStorage.setItem("locale", locale)
	const [primary] = locale.toLocaleLowerCase().split(/-/)
	document.documentElement.lang = primary
	switch (primary) {
		case "zh":
			current = ["zh-TW", $zhTW]
			break
		case "ja":
			current = ["ja-JP", $jaJP]
			break
		default:
			current = ["en-US", $enUS]
			break
	}
}
