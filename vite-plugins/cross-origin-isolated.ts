import { type PluginOption } from "vite"

export function crossOriginIsolated(): PluginOption {
	return {
		name: "cross-origin-isolated",
		configureServer(server) {
			server.middlewares.use((_req, res, next) => {
				res.setHeader("Cross-Origin-Opener-Policy", "same-origin")
				res.setHeader("Cross-Origin-Embedder-Policy", "require-corp")
				next()
			})
		},
	}
}
