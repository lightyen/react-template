import { useEffect } from "react"
import { createPortal } from "react-dom"
import { useRouteError } from "react-router"

export function ErrorHandler() {
	const err = useRouteError() as Error | null | undefined
	useEffect(() => {
		if (err) {
			// TODO: handle err
		}
	}, [err])
	return createPortal(
		<div tw="bg-background text-foreground h-screen p-5 grid [grid-template-rows: min-content min-content minmax(0, 1fr)]">
			<h1 tw="text-2xl font-bold text-primary">Something went wrong.</h1>
			<hr tw="my-5" />
			{err && (
				<div tw="grid [grid-template-rows: min-content min-content min-content min-content minmax(0, 1fr)]">
					<h1 tw="text-xl font-semibold mb-6 text-foreground">Message:</h1>
					<pre tw="overflow-auto pb-4">
						<code tw="text-rose-500 italic">{err.message}</code>
					</pre>
					<hr tw="my-5" />
					<h1 tw="text-xl font-semibold mb-6 text-foreground">Stack:</h1>
					<pre tw="overflow-auto pb-4">
						<code>{err.stack}</code>
					</pre>
				</div>
			)}
		</div>,
		document.body,
	)
}
