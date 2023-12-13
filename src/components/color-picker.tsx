import { useAction, useSelect } from "@context"
import { useId, useRef } from "react"
import { Button } from "./button"
import { eyeDropper } from "./lib/colors"

export interface ColorPickerProps {
	value?: string
	onColor?(value: string): void
}

export function ColorPicker(props: ColorPickerProps) {
	const colorRef = useRef<HTMLInputElement>(null)
	return (
		<div tw="w-32 aspect-square bg-gradient-to-r from-red-300 to-blue-400">
			<input ref={colorRef} type="color" />
			<TriggerPicker />
			<div tw="h-64 bg-[color(rec2020 1 1 0)]"></div>
		</div>
	)
}

export function TriggerPicker() {
	const id = useId()
	const { openEyeDropper } = useAction().app
	const data = useSelect(state => state.app.eyeDropperResult[id])
	return (
		<div>
			{eyeDropper && (
				<Button
					onClick={() => {
						openEyeDropper(id)
					}}
				>
					Button
				</Button>
			)}
			<span>{data}</span>
		</div>
	)
}
