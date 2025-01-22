import { Global } from "@emotion/react"
import { withThemeFromJSXProvider } from "@storybook/addon-themes"
import type { Preview } from "@storybook/react"
import { globalStyles } from "twobj"
import { appStyle } from "~/App"
import "~/global.css"

/* TODO: replace with your own global styles, or remove */
const GlobalStyles = () => <Global styles={[globalStyles, appStyle]} />

const preview: Preview = {
	tags: ["autodocs"],
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
	},
	decorators: [
		withThemeFromJSXProvider({
			GlobalStyles,
		}),
	],
}

export default preview
