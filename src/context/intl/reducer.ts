import { createReducer } from "@reduxjs/toolkit"
import { createIntl, type IntlShape } from "react-intl"
import * as ac from "./action"
import { getLocale, locales, LocaleType, storeLocale } from "./lib"

interface IntlStoreType {
	locale: string
	useIntl: IntlShape
}

export type IntlStore = Readonly<IntlStoreType>

const [locale, messages] = getLocale()

function createUseIntl(config: { locale: LocaleType; messages: Record<string, string> }) {
	return createIntl({
		defaultLocale: "en-US",
		timeZone: undefined,
		fallbackOnEmptyString: true,
		formats: {},
		defaultFormats: {},
		...config,
	})
}

const init: IntlStore = {
	locale: locale,
	useIntl: createUseIntl({ locale, messages }),
}

export const intl = createReducer(init, builder =>
	builder.addCase(ac.setLocale, (state, { payload: locale }) => {
		if (locale in locales) {
			storeLocale(locale)
			const [loc, messages] = getLocale()
			state.locale = loc
			state.useIntl = createUseIntl({ locale: loc, messages })
		} else {
			throw new Error(`resource "${locale}" is not found.`)
		}
	}),
)
