import { Global } from "@emotion/react"
import type { Preview } from "@storybook/react"
import { globalStyles } from "twobj"
import { appStyle } from "~/App"
import { StoreProvider } from "~/context/Provider"

import "~/global.css"

const preview: Preview = {
	// tags: ["autodocs"],
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
	},
	decorators: [
		Story => (
			<StoreProvider>
				<Global styles={[globalStyles, appStyle]} />
				<Story />
			</StoreProvider>
		),
	],
}

export default preview
