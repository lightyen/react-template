const locales = {
	"en-US": "EN",
	"ja-JP": "日本語",
	"zh-TW": "繁中",
}
import $enUS from "../locales/en-US.yml"
import $jaJP from "../locales/ja-JP.yml"
import $zhTW from "../locales/zh-TW.yml"

const defaultLocale: string = window.navigator.language || "en-US"

export { $enUS, $jaJP, $zhTW, defaultLocale, locales }

export type LocaleType = keyof typeof locales

export function getLocale(): [LocaleType, Record<string, string>] {
	const locale = localStorage.getItem("locale") || defaultLocale
	const [primary] = locale.toLocaleLowerCase().split(/-/)
	switch (primary) {
		case "zh":
			document.documentElement.lang = "zh"
			return ["zh-TW", $zhTW]
		case "ja":
			document.documentElement.lang = "ja"
			return ["ja-JP", $jaJP]
		default:
			document.documentElement.lang = "en"
			return ["en-US", $enUS]
	}
}

export function storeLocale(locale: string) {
	localStorage.setItem("locale", locale)
	const [primary] = locale.toLocaleLowerCase().split(/-/)
	document.documentElement.lang = primary
}
