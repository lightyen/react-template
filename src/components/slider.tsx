import { AriaAttributes, forwardRef, type HTMLAttributes } from "react"

interface SliderProps extends Omit<HTMLAttributes<HTMLSpanElement>, "defaultValue"> {
	onValueChange?(value: number[]): void
	onValueCommit?(value: number[]): void
	disabled?: boolean
	orientation?: AriaAttributes["aria-orientation"]
	defaultValue?: number[]
	min?: number
	max?: number
	step?: number
}

export const Slider = forwardRef<HTMLButtonElement, SliderProps>(
	(
		{
			onValueChange = () => void 0,
			onValueCommit = () => void 0,
			disabled = false,
			orientation = "horizontal",
			defaultValue = [0],
			min = 0,
			max = 100,
			step = 1,
			...props
		},
		ref,
	) => {
		return <span ref={ref} {...props}></span>
	},
)
Slider.displayName = "Slider"

export function SliderTrack() {}

export function SliderRange() {}

export function SliderThumb() {}
