import yaml from "@rollup/plugin-yaml"
import react from "@vitejs/plugin-react"
import { exec } from "node:child_process"
import { promisify } from "node:util"
import license from "rollup-plugin-license"
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

			let tracked = false
			try {
				await promisify(exec)("git diff-index --quiet HEAD")
				tracked = true
			} catch {}

			let matchLatestTag = false
			if (tracked) {
				try {
					const latestCommit = (await promisify(exec)("git rev-parse HEAD")).stdout.trim()
					const latestTag = (
						await promisify(exec)("git rev-list --max-count=1 $(git describe --abbrev=0)")
					).stdout.trim()
					matchLatestTag = latestCommit === latestTag
				} catch {}
			}

			try {
				let version = "unknown"

				if (!tracked) {
					version = "untracked." + (await promisify(exec)("git rev-parse --verify HEAD")).stdout.trim()
				} else if (matchLatestTag) {
					version = (await promisify(exec)("git describe --abbrev")).stdout.trim()
				} else {
					const branch = (await promisify(exec)("git rev-parse --abbrev-ref HEAD")).stdout.trim()
					const hash = (await promisify(exec)("git rev-parse --verify HEAD")).stdout.trim()
					version = `${branch}.${hash}`
				}

				this.emitFile({
					type: "asset",
					name: "version",
					fileName: "version",
					source: version + "\n",
				})
			} catch (err) {
				console.error(err)
			}
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
		license({
			thirdParty: {
				output: "build/assets/vendor.LICENSE.txt",
			},
		}),
	],
	esbuild: {
		logOverride: { "this-is-undefined-in-esm": "silent" },
		banner: "/*! licenses: /assets/vendor.LICENSE.txt */",
		legalComments: "none",
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
