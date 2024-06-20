import {
	PointerEvent,
	PropsWithChildren,
	createContext,
	forwardRef,
	useContext,
	useMemo,
	useRef,
	type AriaAttributes,
	type HTMLAttributes,
} from "react"

interface SliderContext {
	values: number[]
	onValueChange(values: number[]): void
	onValueCommit(value: number[]): void
	min: number
	max: number
	step: number
	orientation: AriaAttributes["aria-orientation"]
	disabled: boolean
}

const sliderContext = createContext(null as unknown as SliderContext)

interface SliderProps extends SliderRootProps {
	onValueChange?(value: number[]): void
	onValueCommit?(value: number[]): void
	disabled?: boolean
	orientation?: AriaAttributes["aria-orientation"]
	defaultValue?: number[]
	min?: number
	max?: number
	step?: number
}

interface SliderRootProps extends Omit<HTMLAttributes<HTMLSpanElement>, "defaultValue"> {}

interface SliderTrackProps extends Omit<HTMLAttributes<HTMLSpanElement>, "defaultValue"> {}

interface SliderRangeProps extends Omit<HTMLAttributes<HTMLSpanElement>, "defaultValue"> {}

export function Slider({
	onValueChange = () => void 0,
	onValueCommit = () => void 0,
	disabled = false,
	orientation = "horizontal",
	defaultValue = [0],
	min = 0,
	max = 100,
	step = 1,
	children,
	...props
}: PropsWithChildren<SliderProps>) {
	const context = useMemo<SliderContext>(() => {
		if (defaultValue == null) {
			return {
				values: defaultValue,
				onValueChange,
				onValueCommit,
				min,
				max,
				step,
				disabled,
				orientation,
			}
		}
		return { values: [0], onValueChange, onValueCommit, min, max, step, disabled, orientation }
	}, [defaultValue, onValueChange, onValueCommit, min, max, step, disabled, orientation])

	return (
		<sliderContext.Provider value={context}>
			<SliderRoot {...props}>{children}</SliderRoot>
		</sliderContext.Provider>
	)
}

function getValueFromPointer(rect: DOMRect, pointerPosition: number, min: number, max: number) {
	const input: [number, number] = [0, rect.width]
	const output: [number, number] = [min, max]

	if (input[0] === input[1] || output[0] === output[1]) {
		return output[0]
	}

	const v = pointerPosition - rect.left
	const ratio = (output[1] - output[0]) / (input[1] - input[0])
	return output[0] + ratio * (v - input[0])
}

export function SliderRoot({
	children,
	onPointerDown,
	onPointerUp,
	onPointerMove,
	...props
}: PropsWithChildren<SliderRootProps>) {
	const { min, max } = useContext(sliderContext)

	const sliderRef = useRef<HTMLSpanElement>(null)
	const rectRef = useRef<DOMRect | undefined>()

	const { onValueChange, onValueCommit } = useContext(sliderContext)

	function handlePointer(event: PointerEvent<HTMLSpanElement>) {
		if (sliderRef.current == null) {
			return
		}

		let rect = rectRef.current!
		if (!rect) {
			rect = sliderRef.current.getBoundingClientRect()
			rectRef.current = rect
		}

		const value = getValueFromPointer(rect, event.clientX, min, max)
		console.log("onValueChange", value)
	}

	return (
		<span
			ref={sliderRef}
			id="slider-root"
			onPointerDown={event => {
				event.preventDefault()
				const target = event.target as HTMLElement
				target.setPointerCapture(event.pointerId)
				handlePointer(event)
			}}
			onPointerMove={event => {
				if (event.pointerId === 0) {
					return
				}
				const target = event.target as HTMLElement
				if (target.hasPointerCapture(event.pointerId)) {
					handlePointer(event)
				}
			}}
			onPointerUp={event => {
				const target = event.target as HTMLElement
				if (target.hasPointerCapture(event.pointerId)) {
					target.releasePointerCapture(event.pointerId)
				}
			}}
			{...props}
		>
			{children}
		</span>
	)
}

export function SliderTrack({ ...props }: PropsWithChildren<SliderTrackProps>) {
	const { disabled, orientation } = useContext(sliderContext)
	return <span {...props} />
}

export function SliderRange({ ...props }: PropsWithChildren<SliderRangeProps>) {
	const { values } = useContext(sliderContext)
	return <span {...props} />
}

interface SliderThumbProps extends HTMLAttributes<HTMLSpanElement> {
	index: number
}

export const SliderThumb = forwardRef<HTMLSpanElement, SliderThumbProps>(({ ...props }, ref) => {
	const { values } = useContext(sliderContext)
	return <span ref={ref} {...props}></span>
})
SliderThumb.displayName = "SliderThumb"
