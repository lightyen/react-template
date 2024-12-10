import { type HTMLAttributes, type Ref } from "react"

interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
	/** 0 - 100 */
	value: number
	ref?: Ref<HTMLDivElement>
}

export function Progress({ value, ...props }: ProgressProps) {
	return (
		<div tw="relative h-2 w-full overflow-hidden rounded-full bg-primary/20" {...props}>
			<div
				tw="h-full w-full flex-1 bg-primary transition-all"
				style={{
					transform: `translateX(-${100 - Math.max(Math.min(100, value), 0)}%)`,
				}}
			/>
		</div>
	)
}
Progress.displayName = "Progress"
