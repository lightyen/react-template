import { createRoot } from "react-dom/client"
import { i18n_init } from "~/context/intl/init"
import { App } from "./App"

const rootEl = document.getElementById("root")
if (rootEl) {
	const root = createRoot(rootEl)
	await i18n_init()
	root.render(<App />)
}
