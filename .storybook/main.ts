import type { StorybookConfig } from "@storybook/react-vite"

export default {
	stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
	addons: [
		"@storybook/addon-onboarding",
		"@storybook/addon-essentials",
		"@chromatic-com/storybook",
		"@storybook/addon-interactions",
		"@storybook/addon-themes",
	],
	framework: {
		name: "@storybook/react-vite",
		options: {},
	},
	typescript: {
		reactDocgen: "react-docgen-typescript",
	},
} satisfies StorybookConfig
