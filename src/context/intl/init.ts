import i18n from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import { initReactI18next } from "react-i18next"
import $enUS from "~/context/intl/locales/en-US.yml"
import $jaJP from "~/context/intl/locales/ja-JP.yml"
import $zhTW from "~/context/intl/locales/zh-TW.yml"

export async function i18n_init() {
	const detector = new LanguageDetector(null, {
		order: ["querystring", "localStorage", "navigator"],
		caches: [],
		lookupQuerystring: "lang",
		lookupLocalStorage: "locale",
	})

	await i18n
		.use(detector)
		.use(initReactI18next)
		.init({
			fallbackLng: "en-US",
			resources: {
				"en-US": { translation: $enUS },
				"ja-JP": { translation: $jaJP },
				"zh-TW": { translation: $zhTW },
			},
			interpolation: { escapeValue: false, prefix: "{", suffix: "}" },
			react: {
				transKeepBasicHtmlNodesFor: ["br", "strong", "i", "p", "b"],
			},
		})
}
