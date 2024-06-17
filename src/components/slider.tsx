import { type AriaAttributes } from "react"

interface SliderRootProps {
	onValueChange?(value: number[]): void
	onValueCommit?(value: number[]): void
	disabled?: boolean
	orientation?: AriaAttributes["aria-orientation"]
	defaultValue?: number[]

	min?: number
	max?: number
	step?: number
}

export function SliderRoot() {}

export function SliderTrack() {}

export function SliderRange() {}

export function SliderThumb() {}
