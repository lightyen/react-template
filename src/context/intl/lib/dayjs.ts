import dayjs from "dayjs"
import "dayjs/locale/en"
import "dayjs/locale/ja"
import localeZhTW from "dayjs/locale/zh-tw"
import localizedFormat from "dayjs/plugin/localizedFormat"

import { getLocale } from "./common"

function setDayjs(locale: string) {
	const [primary] = locale.toLocaleLowerCase().split(/-/)
	switch (primary) {
		case "zh":
			dayjs.locale("zh-tw")
			return
		case "ja":
			dayjs.locale("ja")
			return
		default:
			dayjs.locale("en")
			return
	}
}

localeZhTW.formats["LLLL"] = "YYYY年M月D日 dddd HH:mm"
localeZhTW.formats["llll"] = "YYYY年M月D日 dddd HH:mm"
dayjs.locale(localeZhTW, undefined, true)
dayjs.extend(localizedFormat)
setDayjs(getLocale()[0])

export function setLocale(locale: string) {
	setDayjs(locale)
}

export const format = (date: Date, formatStr: string) => {
	dayjs(date).format(formatStr)
}
