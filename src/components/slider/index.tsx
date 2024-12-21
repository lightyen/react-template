import {
	Children,
	cloneElement,
	createContext,
	isValidElement,
	memo,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react"
import { create } from "zustand"
import { useShallow } from "zustand/react/shallow"
import { composeEventHandlers, composeRefs, isElement } from "../lib"

type Orientation = "horizontal" | "vertical"
type Direction = "ltr" | "rtl"
type SlideDirection = "from-left" | "from-right" | "from-bottom" | "from-top"

interface SliderRootProps extends React.HTMLAttributes<HTMLSpanElement> {
	onValueChange?(value: number[]): void
	onValueCommit?(value: number[]): void
	disabled?: boolean
	orientation?: Orientation
	inverted?: boolean
	dir?: Direction
	value?: number[]
	min?: number
	max?: number
	step?: number
}

const PAGE_KEYS = ["PageUp", "PageDown"]
const ARROW_KEYS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]

const BACK_KEYS: Record<SlideDirection, string[]> = {
	"from-left": ["Home", "PageDown", "ArrowDown", "ArrowLeft"],
	"from-right": ["Home", "PageDown", "ArrowDown", "ArrowRight"],
	"from-bottom": ["Home", "PageDown", "ArrowDown", "ArrowLeft"],
	"from-top": ["Home", "PageDown", "ArrowUp", "ArrowLeft"],
}

interface SliderOptions {
	onValueChange?(value: number[]): void
	onValueCommit?(value: number[]): void

	value: number[]

	min: number
	max: number
	step: number
	orientation: Orientation
	inverted: boolean
	dir: Direction
	disabled: boolean
}

interface SliderStore {
	onValueChange(value: number[]): void
	onValueCommit(value: number[]): void

	min: number
	max: number
	step: number
	orientation: Orientation
	inverted: boolean
	dir: Direction
	disabled: boolean

	activeIndex: number

	value: number[]
	setValue(index: number, value: number): void
	setStep(index: number, step: number): void
	commit(): void
}

function createStore({ onValueChange = () => void 0, onValueCommit = () => void 0, value, ...options }: SliderOptions) {
	return create<SliderStore>(set => {
		return {
			...options,
			activeIndex: -1,
			value: value.map(v => clamp(v, options.min, options.max)),
			onValueChange,
			onValueCommit,
			setValue(index, nextValue) {
				return set(state => {
					if (index >= state.value.length) {
						return {}
					}
					const prevValue = state.value[index]
					if (prevValue === nextValue) {
						return {}
					}
					const value = state.value.with(index, nextValue)
					state.onValueChange(value)
					return { value }
				})
			},
			setStep(index, step) {
				set(state => {
					if (index >= state.value.length) {
						return {}
					}
					if (step === 0) {
						return {}
					}
					const prevValue = state.value[index]
					const nextValue = clamp(state.value[index] + step, state.min, state.max)
					if (prevValue === nextValue) {
						return {}
					}
					const value = state.value.with(index, nextValue)
					state.onValueChange(value)
					state.onValueCommit(value)
					return { value }
				})
			},
			commit() {
				set(state => {
					state.onValueCommit(state.value)
					return {}
				})
			},
		}
	})
}

function useSlider(options: SliderOptions) {
	const { value, min, max, step, disabled, orientation, inverted, dir } = options
	const ref = useRef<ReturnType<typeof createStore> | null>(null)
	const mountedRef = useRef(false)
	const [, setCounter] = useState(0)

	useEffect(() => {
		if (!mountedRef.current) {
			mountedRef.current = true
			return
		}
		ref.current = null
		setCounter(v => v + 1)
	}, [value, min, max, step, disabled, orientation, inverted, dir])

	if (ref.current == null) {
		ref.current = createStore(options)
	}
	return ref.current
}

const SliderContext = createContext(null as unknown as ReturnType<typeof createStore>)

function Provider({ children, store }: React.PropsWithChildren<{ store: ReturnType<typeof useSlider> }>) {
	return <SliderContext value={store}>{children}</SliderContext>
}

function useSliderStore() {
	return useContext(SliderContext)
}

const ThumbCollectionContext = createContext(null as unknown as Map<number, HTMLElement>)

export const SliderRoot = memo(
	function SliderRoot({
		onValueChange = () => void 0,
		onValueCommit = () => void 0,
		disabled = false,
		orientation = "horizontal",
		inverted = false,
		dir = "ltr",
		value,
		min = 0,
		max = 100,
		step = 1,
		children,
		...props
	}: React.PropsWithChildren<SliderRootProps>) {
		if (!value) {
			value = [min]
		}
		const useSelect = useSlider({
			value,
			onValueChange,
			onValueCommit,
			min,
			max,
			step,
			disabled,
			orientation,
			inverted,
			dir,
		})

		const f = Children.toArray(children).filter(isValidElement)
		const trackElements = f.filter(e => isElement(e, SliderTrack))
		const thumbElements = f
			.filter((e): e is React.ReactElement<React.ComponentProps<typeof SliderThumb>> => isElement(e, SliderThumb))
			.map((e, index) => cloneElement(e, { index }))
			.slice(0, value.length)

		const thumbs = useRef(new Map<number, HTMLElement>())
		const setStep = useSelect(state => state.setStep)
		const setValue = useSelect(state => state.setValue)
		const commit = useSelect(state => state.commit)

		function updateValues(nextValue: number, activeIndex: number) {
			const t = thumbs.current.get(activeIndex)
			if (t) {
				const d = (String(value).split(".")[1] ?? "").length
				nextValue = min + Math.round((nextValue - min) / step) * step
				nextValue = Number(nextValue.toFixed(d))
				setValue(activeIndex, clamp(nextValue, min, max))
			}
		}

		const slideDirection = useSelect((state): SlideDirection => {
			if (state.orientation === "vertical") {
				return state.inverted ? "from-top" : "from-bottom"
			}
			const isRTL = state.dir === "rtl"
			return isRTL === state.inverted ? "from-left" : "from-right"
		})

		return (
			<ThumbCollectionContext value={thumbs.current}>
				<Provider store={useSelect}>
					<SliderRootImpl
						onSlideStart={(event, value, activeIndex) => {
							if (disabled || activeIndex === -1) {
								return
							}
							updateValues(value, activeIndex)
						}}
						onSlideMove={(event, value, activeIndex) => {
							if (disabled || activeIndex === -1) {
								return
							}
							updateValues(value, activeIndex)
						}}
						onSlideEnd={(event, activeIndex) => {
							if (disabled || activeIndex === -1) {
								return
							}
							commit()
						}}
						onHomeKeyDown={(event, activeIndex) => {
							if (disabled || activeIndex === -1) {
								return
							}
							setValue(activeIndex, min)
						}}
						onEndKeyDown={(event, activeIndex) => {
							if (disabled || activeIndex === -1) {
								return
							}
							setValue(activeIndex, max)
						}}
						onStepKeyDown={(event, activeIndex) => {
							if (disabled || activeIndex === -1) {
								return
							}
							const isPageKey = PAGE_KEYS.includes(event.key)
							const isSkipKey = isPageKey || (event.shiftKey && ARROW_KEYS.includes(event.key))
							const multiplier = isSkipKey ? 10 : 1
							const isBackKey = BACK_KEYS[slideDirection].includes(event.key)
							const stepDirection = isBackKey ? -1 : 1
							const stepInDirection = step * multiplier * stepDirection
							setStep(activeIndex, stepInDirection)
						}}
						{...props}
					>
						{trackElements}
						{thumbElements}
					</SliderRootImpl>
				</Provider>
			</ThumbCollectionContext>
		)
	},
	({ value: prevValue, ...prevProps }, { value: nextValue, ...nextProps }) => {
		const keysA = Object.keys(prevProps)
		const keysB = Object.keys(nextProps)
		if (keysA.length !== keysB.length) {
			return false
		}

		for (const k of keysA) {
			if (!Object.prototype.hasOwnProperty.call(nextProps, k) || prevProps[k] !== nextProps[k]) {
				return false
			}
		}

		if (prevValue != null || nextValue != null) {
			if (prevValue == null) {
				return false
			}
			if (nextValue == null) {
				return false
			}
			if (prevValue.length !== nextValue.length) {
				return false
			}
			for (let i = 0; i < prevValue.length; i++) {
				if (prevValue[i] !== nextValue[i]) {
					return false
				}
			}
		}

		return true
	},
)
SliderRoot.displayName = "SliderRoot"
SliderRoot["$id"] = Symbol.for("com.SliderRoot")

function linearScale(input: readonly [number, number], output: readonly [number, number]) {
	return (value: number) => {
		if (input[0] === input[1] || output[0] === output[1]) {
			return output[0]
		}
		const ratio = (output[1] - output[0]) / (input[1] - input[0])
		return output[0] + ratio * (value - input[0])
	}
}

function clamp(value: number, min: number, max: number): number {
	return Math.min(Math.max(min, value), max)
}

function swapif<T>(cond: boolean, t: [T, T]): [T, T] {
	if (cond) {
		return [t[1], t[0]]
	}
	return t
}

function getClosestValueIndex(values: number[], nextValue: number) {
	if (values.length === 1) {
		return 0
	}
	const distances = values.map(value => Math.abs(value - nextValue))
	const closestDistance = Math.min(...distances)
	return distances.indexOf(closestDistance)
}

function getValueFromPointer(
	event: React.PointerEvent<HTMLElement>,
	rect: DOMRect,
	min: number,
	max: number,
	inverted: boolean,
	orientation: Orientation,
	dir: Direction,
) {
	let input: [number, number]
	if (orientation === "vertical") {
		input = swapif(inverted, [rect.height, 0])
	} else {
		const isRTL = dir === "rtl"
		const fromLeft = isRTL === inverted
		input = swapif(fromLeft, [rect.width, 0])
	}
	const output: [number, number] = [min, max]
	const value = orientation === "vertical" ? event.clientY - rect.top : event.clientX - rect.left
	return linearScale(input, output)(value)
}

interface SliderPrivateProps<T = HTMLSpanElement> extends Omit<React.HTMLAttributes<T>, "defaultValue"> {
	onSlideEnd(event: React.PointerEvent<T>, index: number): void
	onSlideStart(event: React.PointerEvent<T>, value: number, index: number): void
	onSlideMove(event: React.PointerEvent<T>, value: number, index: number): void
	onHomeKeyDown(event: React.KeyboardEvent<T>, index: number): void
	onEndKeyDown(event: React.KeyboardEvent<T>, index: number): void
	onStepKeyDown(event: React.KeyboardEvent<T>, index: number): void
}

function SliderRootImpl({
	ref,
	onKeyDown,
	onPointerDown,
	onPointerUp,
	onPointerMove,
	onSlideStart,
	onSlideMove,
	onSlideEnd,
	onHomeKeyDown,
	onEndKeyDown,
	onStepKeyDown,
	children,
	...props
}: SliderPrivateProps & { ref?: React.Ref<HTMLSpanElement> }) {
	const useSelect = useSliderStore()
	const disabled = useSelect(state => state.disabled)
	const min = useSelect(state => state.min)
	const max = useSelect(state => state.max)
	const inverted = useSelect(state => state.inverted)
	const orientation = useSelect(state => state.orientation)
	const dir = useSelect(state => state.dir)
	const activeIndex = useRef(-1)

	const sliderRef = useRef<HTMLButtonElement>(null)
	const rectRef = useRef<DOMRect | undefined>(undefined)

	function handlePointer(event: React.PointerEvent<HTMLElement>) {
		if (!sliderRef.current) {
			return
		}

		let rect = rectRef.current
		if (!rect) {
			rect = sliderRef.current.getBoundingClientRect()
			rectRef.current = rect
		}

		return getValueFromPointer(event, rect, min, max, inverted, orientation, dir)
	}

	return (
		<span
			ref={composeRefs(ref, sliderRef)}
			data-orientation={orientation}
			aria-disabled={disabled}
			css={disabled && { opacity: 0.5 }}
			onKeyDown={composeEventHandlers(onKeyDown, event => {
				if (event.key === "Home") {
					event.preventDefault()
					onHomeKeyDown(event, activeIndex.current)
				} else if (event.key === "End") {
					event.preventDefault()
					onEndKeyDown(event, activeIndex.current)
				} else if (PAGE_KEYS.concat(ARROW_KEYS).includes(event.key)) {
					event.preventDefault()
					onStepKeyDown(event, activeIndex.current)
				}
			})}
			onPointerDown={composeEventHandlers(onPointerDown, event => {
				const target = event.target
				if (!(target instanceof Element)) {
					return
				}
				event.preventDefault()
				target.setPointerCapture(event.pointerId)
				const value = handlePointer(event)
				if (value == undefined) {
					return
				}
				activeIndex.current = getClosestValueIndex(useSelect.getState().value, value)
				onSlideStart(event, value, activeIndex.current)
			})}
			onPointerMove={composeEventHandlers(onPointerMove, event => {
				if (event.pointerId === 0) {
					return
				}
				const target = event.target
				if (!(target instanceof Element)) {
					return
				}
				if (target.hasPointerCapture(event.pointerId)) {
					const value = handlePointer(event)
					if (value == undefined) {
						return
					}
					onSlideMove(event, value, activeIndex.current)
				}
			})}
			onPointerUp={composeEventHandlers(onPointerUp, event => {
				const target = event.target
				if (!(target instanceof Element)) {
					return
				}
				if (target.hasPointerCapture(event.pointerId)) {
					target.releasePointerCapture(event.pointerId)
					rectRef.current = undefined
					onSlideEnd(event, activeIndex.current)
				}
			})}
			{...props}
		>
			{children}
		</span>
	)
}

export function SliderTrack(props: React.PropsWithChildren<{ ref?: React.Ref<HTMLSpanElement> }>) {
	const useSelect = useSliderStore()
	const orientation = useSelect(state => state.orientation)
	return <span data-orientation={orientation} tw="pointer-events-none" {...props} />
}
SliderTrack.displayName = "SliderTrack"
SliderTrack["$id"] = Symbol.for("com.SliderTrack")

export function SliderRange(props: { ref?: React.Ref<HTMLSpanElement> }) {
	const useSelect = useSliderStore()
	const orientation = useSelect(state => state.orientation)
	const style = useSelect(
		useShallow(({ orientation, inverted, dir, value, min, max }) => {
			const transform = linearScale([min, max], [0, 100])
			const [start, end] = [value.length > 1 ? transform(Math.min(...value)) : 0, transform(Math.max(...value))]
			if (orientation === "vertical") {
				const [top, bottom] = swapif(inverted, [`${100 - end}%`, `${start}%`])
				return { top, bottom }
			}
			const [left, right] = swapif(inverted !== (dir === "rtl"), [`${start}%`, `${100 - end}%`])
			return { left, right }
		}),
	)
	return <span data-orientation={orientation} css={style} {...props} />
}
SliderRange.displayName = "SliderRange"
SliderRange["$id"] = Symbol.for("com.SliderRange")

export function SliderThumb({ index = -1, ref, ...props }: { index?: number; ref?: React.Ref<HTMLSpanElement> }) {
	const innerRef = useRef<HTMLSpanElement>(null)
	const useSelect = useSliderStore()

	const disabled = useSelect(state => state.disabled)
	const value = useSelect(state => state.value[index])
	const percent = useSelect(({ min, max }) => linearScale([min, max], [0, 100])(value))

	const mountedRef = useRef(false)
	useEffect(() => {
		if (!mountedRef.current) {
			mountedRef.current = true
			return
		}
		const element = innerRef.current
		if (element && !disabled) {
			element.focus()
		}
	}, [disabled, value])

	const thumbs = useContext(ThumbCollectionContext)
	useEffect(() => {
		const element = innerRef.current
		if (element) {
			thumbs.set(index, element)
		}
		return () => {
			if (element) {
				thumbs.delete(index)
			}
		}
	}, [index, thumbs])

	const slideDirection = useSelect((state): SlideDirection => {
		if (state.orientation === "vertical") {
			return state.inverted ? "from-top" : "from-bottom"
		}
		const isRTL = state.dir === "rtl"
		return isRTL === state.inverted ? "from-left" : "from-right"
	})

	const style = useMemo(() => {
		switch (slideDirection) {
			case "from-left":
				return (percent: number) => ({
					left: `calc(${percent}%)`,
					transform: `translateX(-${percent}%)`,
				})
			case "from-right":
				return (percent: number) => ({
					right: `calc(${percent}%)`,
					transform: `translateX(${percent}%)`,
				})
			case "from-top":
				return (percent: number) => ({
					top: `calc(${percent}%)`,
					transform: `translateY(-${percent}%)`,
				})
			case "from-bottom":
				return (percent: number) => ({
					bottom: `calc(${percent}%)`,
					transform: `translateY(${percent}%)`,
				})
		}
	}, [slideDirection])

	return (
		<span tw="absolute" css={style(percent)}>
			<span ref={composeRefs(ref, innerRef)} tabIndex={0} {...props} />
		</span>
	)
}
SliderThumb.displayName = "SliderThumb"
SliderThumb["$id"] = Symbol.for("com.SliderThumb")
