import { StoreProvider } from "@context/Provider"
import { Global, css } from "@emotion/react"
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
				<RouterProvider router={router} />
			</StoreProvider>
		</DebugMode>
	)
}
