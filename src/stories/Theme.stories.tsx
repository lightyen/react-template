import { type Meta, type StoryObj } from "@storybook/react"
import { SwitchPrimaryColor as Color } from "~/concepts/SwitchPrimaryColor"
import { SwitchTheme } from "~/concepts/SwitchTheme"

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
	title: "Theme",
} as Meta

export default meta

export const LightDark = {
	name: "light & dark",
	render() {
		return <SwitchTheme />
	},
} satisfies StoryObj<typeof meta>

export const SwitchPrimaryColor = {
	name: "switch primary color",
	render() {
		return <Color />
	},
}
