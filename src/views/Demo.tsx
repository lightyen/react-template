export function Component() {
	return (
		<div tw="bg-red-400">
			<div
				tw="
			[--mycolor: oklch(43.7% 0.078 188.216)]

			// [background: var(--mycolor)]
			[background:linear-gradient(in oklab blue, color-mix(in oklab, var(--mycolor) 100%, transparent))]
			bg-gradient-to-r
			"
			>
				ASASDAS
			</div>
		</div>
	)
}
