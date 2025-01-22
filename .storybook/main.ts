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
	core: {
		builder: "@storybook/builder-vite",
	},
	framework: {
		name: "@storybook/react-vite",
		options: {},
	},
	typescript: {
		reactDocgen: "react-docgen-typescript",
	},
	async viteFinal(config) {
		const { mergeConfig } = await import("vite")
		return mergeConfig(config, {
			optimizeDeps: {
				include: [],
			},
		})
	},
} satisfies StorybookConfig
