import { StoreProvider } from "@context/Provider"
import { Global, css } from "@emotion/react"
import { StrictMode } from "react"
import { RouterProvider } from "react-router"
import { globalStyles, tw } from "twobj"
import { router } from "./Router"

import "./global.css"
import { useIntl } from "./i18n"

const bodyScrollbar = tw`
	not-mobile:(
		[@supports selector(::-webkit-scrollbar)]:(
			[::-webkit-scrollbar]:(w-[7px] h-[7px])
			hover:[::-webkit-scrollbar-thumb]:bg-foreground/20
			[::-webkit-scrollbar-thumb]:(bg-muted bg-clip-content hover:bg-foreground/25)
		)
	)
`

export const appStyle = css`
	${bodyScrollbar}
	body {
		${tw`
			bg-background text-foreground font-normal leading-normal font-sans
			m-0 min-w-[320px] min-h-screen
		`}
	}
`

function AppFont() {
	const style = useIntl(s => {
		switch (s.locale) {
			case "ja-JP":
				return tw`[:root]:[--font-sans: "メイリオ", "Meiryo", "ヒラギノ角ゴ Pro W3", "Hiragino Kaku Gothic Pro", "YuGothic", "Yu Gothic", "ＭＳ Ｐゴシック", "MS PGothic"]`
			default:
				return tw``
		}
	})
	return <Global styles={style} />
}

function DebugMode({ children }: React.PropsWithChildren<{}>) {
	const enable = Boolean(localStorage.getItem("strict"))
	if (!enable) {
		return children
	}
	if (import.meta.env.DEV) {
		console.log("StrictMode is enabled.")
	}
	return <StrictMode>{children}</StrictMode>
}

export function App() {
	return (
		<DebugMode>
			<StoreProvider>
				<Global styles={[globalStyles, appStyle]} />
				<AppFont />
				<RouterProvider router={router} />
			</StoreProvider>
		</DebugMode>
	)
}
