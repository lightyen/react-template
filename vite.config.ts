import emotion from "@rolldown/plugin-emotion"
import yaml from "@rollup/plugin-yaml"
import react from "@vitejs/plugin-react"
import twobj from "rolldown-plugin-twobj"
import { visualizer } from "rollup-plugin-visualizer"
import { defineConfig } from "vite"
import checker from "vite-plugin-checker"
import svgr from "vite-plugin-svgr"
import tailwindConfig from "./tailwind.config"
import { crossOriginIsolated } from "./vite-plugins/cross-origin-isolated"
import { version } from "./vite-plugins/version"

const target = `http://${process.env.API_ENTRY}`

export default defineConfig({
	resolve: { tsconfigPaths: true },
	build: {
		sourcemap: "hidden",
		chunkSizeWarningLimit: 4 << 10,
		license: process.env.NODE_ENV === "production" ? { fileName: "license.md" } : false,
	},
	plugins: [
		crossOriginIsolated(),
		version(),
		yaml(),
		svgr({ include: "**/*.svg", oxcOptions: { jsx: { runtime: "automatic" } } }),
		twobj({ tailwindConfig, throwError: true }),
		emotion(),
		react({ jsxImportSource: "@emotion/react" }),
		process.env.CHECK === "true" && visualizer(),
		process.env.CHECK === "true" && checker({ typescript: true }),
	],
	server: {
		host: "0.0.0.0",
		proxy: {
			"^/apis/stream$": {
				target,
				configure(proxy, _) {
					proxy.on("proxyReq", (proxyReq, request, response) => {
						response.on("close", () => proxyReq.destroy())
					})
				},
			},
			"^/apis.*": target,
		},
	},
})
