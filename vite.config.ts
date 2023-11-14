import yaml from "@rollup/plugin-yaml"
import react from "@vitejs/plugin-react"
import { exec } from "node:child_process"
import { promisify } from "node:util"
import { visualizer } from "rollup-plugin-visualizer"
import { defineConfig, PluginOption } from "vite"
import eslint from "vite-plugin-eslint"
import svg from "vite-plugin-svgr"
import tsConfigPaths from "vite-plugin-tsconfig-paths"
import tailwindConfig from "./tailwind.config"

const target = `http://${process.env.API_ENTRY}`

function gitcommit(): PluginOption {
	return {
		name: "git-commit",
		enforce: "post",
		async buildEnd(err) {
			if (process.env.NODE_ENV !== "production") {
				return
			}
			if (err != null) {
				return
			}
			try {
				const result = await promisify(exec)("git rev-parse --verify HEAD")
				this.emitFile({
					type: "asset",
					name: "version",
					fileName: "version",
					source: result.stdout.trim(),
				})
			} catch {}
		},
	}
}

export default defineConfig({
	base: "",
	build: {
		sourcemap: true,
		outDir: "build",
		chunkSizeWarningLimit: 4 << 10,
	},
	plugins: [
		gitcommit(),
		visualizer(),
		yaml(),
		svg({ include: "**/*.svg" }),
		eslint(),
		tsConfigPaths(),
		react({
			jsxImportSource: "@emotion/react",
			babel: {
				plugins: [["twobj", { tailwindConfig, throwError: true }], "@emotion"],
			},
		}),
	],
	esbuild: {
		logOverride: { "this-is-undefined-in-esm": "silent" },
	},
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
