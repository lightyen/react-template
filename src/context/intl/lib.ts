const locales = {
	"en-US": "EN",
	"ja-JP": "日本語",
	"zh-TW": "繁中",
}
import $enUS from "./locales/en-US.yml"
import $jaJP from "./locales/ja-JP.yml"
import $zhTW from "./locales/zh-TW.yml"

const defaultLocale: string = window.navigator.language || "en-US"

export { $enUS, $jaJP, $zhTW, defaultLocale, locales }

export type LocaleType = keyof typeof locales

let cache: [LocaleType, Record<string, string>]

export function getLocale(): [LocaleType, Record<string, string>] {
	if (cache) {
		return cache
	}
	const locale = localStorage.getItem("locale") ?? defaultLocale
	const [primary] = locale.toLocaleLowerCase().split(/-/)
	document.documentElement.lang = primary
	switch (primary) {
		case "zh":
			cache = ["zh-TW", $zhTW]
			break
		case "ja":
			cache = ["ja-JP", $jaJP]
			break
		default:
			cache = ["en-US", $enUS]
			break
	}
	return cache
}

export function storeLocale(locale: string) {
	console.log("store")
	localStorage.setItem("locale", locale)
	const [primary] = locale.toLocaleLowerCase().split(/-/)
	document.documentElement.lang = primary
	switch (primary) {
		case "zh":
			cache = ["zh-TW", $zhTW]
			break
		case "ja":
			cache = ["ja-JP", $jaJP]
			break
		default:
			cache = ["en-US", $enUS]
			break
	}
}
