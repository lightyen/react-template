import babel from "@rolldown/plugin-babel"
import yaml from "@rollup/plugin-yaml"
import react from "@vitejs/plugin-react"
import license from "rollup-plugin-license"
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
	build: { sourcemap: true, chunkSizeWarningLimit: 4 << 10 },
	plugins: [
		crossOriginIsolated(),
		version(),
		visualizer(),
		yaml(),
		svgr({ include: "**/*.svg", oxcOptions: { jsx: { runtime: "automatic" } } }),
		react({ jsxImportSource: "@emotion/react" }),
		babel({ plugins: [["twobj", { tailwindConfig, throwError: true }], "@emotion"] }),
		license({ thirdParty: { output: "dist/LICENSE.txt" } }),
		process.env.TYPE_CHECK === "true" && checker({ typescript: true }),
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
