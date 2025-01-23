import type { StorybookConfig } from "@storybook/react-vite"

export default {
	stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
	addons: ["@storybook/addon-essentials"],
	core: {
		builder: "@storybook/builder-vite",
	},
	framework: {
		name: "@storybook/react-vite",
		options: {},
	},
	// typescript: {
	// 	reactDocgen: "react-docgen-typescript",
	// },
	async viteFinal(config) {
		const { mergeConfig } = await import("vite")
		return mergeConfig(config, {
			assetsInclude: ["/sb-preview/runtime.js", "/favicon.svg"],
			optimizeDeps: {
				include: [],
			},
		})
	},
} satisfies StorybookConfig
