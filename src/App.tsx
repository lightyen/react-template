import { StoreProvider } from "@context/Provider"
import { Global, css } from "@emotion/react"
import qs from "qs"
import { StrictMode } from "react"
import { RouterProvider } from "react-router"
import { globalStyles, tw } from "twobj"
import { router } from "./Router"

import "./global.css"

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
			bg-background text-foreground font-normal leading-normal font-sans [font-display: optional]
			m-0 min-w-[320px] min-h-screen
		`}
	}
`

function DebugMode({ children }: React.PropsWithChildren<{}>) {
	const o = qs.parse(window.location.search.replace(/^\?/, ""))
	const enable = Object.prototype.hasOwnProperty.call(o, "strict") && Boolean(o["strict"])
	if (!enable) {
		return children
	}
	return <StrictMode>{children}</StrictMode>
}

export function App() {
	return (
		<DebugMode>
			<StoreProvider>
				<Global styles={[globalStyles, appStyle]} />
				<RouterProvider router={router} />
			</StoreProvider>
		</DebugMode>
	)
}
