import yaml from "@rollup/plugin-yaml"
import react from "@vitejs/plugin-react"
import { formatISO } from "date-fns"
import { exec, ExecException } from "node:child_process"
import license from "rollup-plugin-license"
import { visualizer } from "rollup-plugin-visualizer"
import { defineConfig, PluginOption } from "vite"
import checker from "vite-plugin-checker"
import svg from "vite-plugin-svgr"
import tsConfigPaths from "vite-plugin-tsconfig-paths"
import tailwindConfig from "./tailwind.config"

const target = `http://${process.env.API_ENTRY}`

interface Output {
	error: ExecException | null
	stdout: string
	stderr: string
}

async function shell(command: string) {
	return new Promise<Output>(res => {
		exec(command, (error, stdout, stderr) => {
			res({ error, stdout: stdout.trim(), stderr: stderr.trim() })
		})
	})
}

const ver = await gitVersion()
console.log("VERSION:", ver)

async function gitVersion(): Promise<string> {
	if ((await shell("git rev-parse --git-dir")).error) {
		return "0.0.0"
	}

	let tag = (await shell("git describe --tags --abbrev=0")).stdout
	if (!tag) {
		tag = "0.0.0"
	}

	const current = (await shell("git rev-parse --verify HEAD")).stdout
	if (!current) {
		return `${tag}-untracked`
	}

	if ((await shell("git status --short")).stdout) {
		const short = (await shell("git rev-parse --verify HEAD --short")).stdout
		return `${tag}-untracked+${short}`
	}

	if (
		current ===
		(await shell("git rev-list --max-count=1 " + (await shell("git describe --abbrev=0")).stdout)).stdout
	) {
		return tag
	}

	const branch = (await shell("git rev-parse --abbrev-ref HEAD")).stdout
	const short = (await shell("git rev-parse --verify HEAD --short")).stdout

	return `${tag}-${branch}+${short}`
}

function gitcommit(): PluginOption {
	return {
		name: "git-commit",
		enforce: "post",
		buildEnd(err) {
			if (process.env.NODE_ENV !== "production") {
				return
			}
			if (err != null) {
				return
			}

			const json = {
				product_short: process.env.VITE_PRODUCT_SHORT,
				product_name: process.env.VITE_PRODUCT_NAME,
				value: "",
				date: formatISO(new Date()),
			}

			json.value = ver
			this.emitFile({
				type: "asset",
				name: "version.json",
				fileName: "version.json",
				source: JSON.stringify(json) + "\n",
			})
		},
	}
}

function enableCrossOriginIsolated(): PluginOption {
	return {
		name: "configure-server",

		configureServer(server) {
			server.middlewares.use((_req, res, next) => {
				res.setHeader("Cross-Origin-Opener-Policy", "same-origin")
				res.setHeader("Cross-Origin-Embedder-Policy", "require-corp")
				next()
			})
		},
	}
}

export default defineConfig({
	base: "",
	build: {
		sourcemap: true,
		chunkSizeWarningLimit: 4 << 10,
	},
	plugins: [
		process.env.NODE_ENV === "production" && checker({ typescript: true }),
		enableCrossOriginIsolated(),
		gitcommit(),
		visualizer(),
		yaml(),
		svg({ include: "**/*.svg" }),
		tsConfigPaths(),
		react({
			jsxImportSource: "@emotion/react",
			babel: {
				plugins: [["twobj", { tailwindConfig, throwError: true }], "@emotion"],
			},
		}),
		license({
			thirdParty: {
				output: "dist/assets/vendor.LICENSE.txt",
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
