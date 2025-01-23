import { type Meta, type StoryObj } from "@storybook/react"
import { SwitchLanguage } from "~/concepts/SwitchLanguage"
import { SwitchPrimaryColor as Color } from "~/concepts/SwitchPrimaryColor"
import { SwitchTheme } from "~/concepts/SwitchTheme"

export default {
	tags: ["!autodocs"],
	title: "Theme",
	parameters: {
		layout: "centered",
	},
} as Meta

export const LightDark = {
	name: "light & dark",
	render() {
		return <SwitchTheme />
	},
} satisfies StoryObj

export const SwitchPrimaryColor = {
	name: "switch primary color",
	render() {
		return <Color />
	},
} satisfies StoryObj

export const SwitchLang = {
	name: "switch language",
	render() {
		return <SwitchLanguage />
	},
} satisfies StoryObj
