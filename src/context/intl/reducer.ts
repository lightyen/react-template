import { createReducer } from "@reduxjs/toolkit"
import * as ac from "./action"
import { getLocale, locales, storeLocale } from "./lib"

interface IntlStoreType {
	locale: string
}

export type IntlStore = Readonly<IntlStoreType>

const [locale] = getLocale()

const init: IntlStore = {
	locale: locale,
}

export const intl = createReducer(init, builder =>
	builder.addCase(ac.setLocale, (state, { payload: locale }) => {
		if (locale in locales) {
			storeLocale(locale)
			state.locale = locale
		} else {
			throw new Error(`resource "${locale}" is not found.`)
		}
	}),
)
