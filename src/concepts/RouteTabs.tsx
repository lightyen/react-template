import {
	Children,
	InputHTMLAttributes,
	MouseEventHandler,
	Ref,
	useCallback,
	useEffect,
	useId,
	useLayoutEffect,
	useRef,
	useState,
	type ReactElement,
} from "react"
import { type NavigateFunction } from "react-router"
import { isElement } from "~/components/lib"

interface RouteTabProps {
	title: ReactElement | string | number
	to: string
}

export function RouteTab(_props: RouteTabProps) {
	return null
}
RouteTab["$id"] = Symbol.for("com.RouteTab")

interface RouterTabsProps {
	children: ReactElement<RouteTabProps> | ReactElement<RouteTabProps>[]
	to?: string
	onNavigate?: NavigateFunction
}

export function RouterTabs({ children, to: propTo, onNavigate = () => void 0 }: RouterTabsProps) {
	const name = useId()

	const [stateTo, setTo] = useState(() => propTo)

	const labels = Children.toArray(children).filter((e): e is ReactElement<RouteTabProps> => isElement(e, RouteTab))

	const [indices, setIndices] = useState(() => labels.map((_, i) => name + String(i)))

	useEffect(() => {
		if (propTo) {
			setTo(propTo)
		}
	}, [propTo])

	useEffect(() => {
		if (labels.length !== indices.length) {
			setIndices(labels.map((_, i) => name + String(i)))
		}
	}, [labels, name, indices, setIndices])

	const notMatched = labels.findIndex(({ props: { to } }) => to === stateTo) === -1

	interface Rect {
		offsetLeft: number
		clientWidth: number
	}

	const parentRef = useRef<HTMLDivElement>(null)
	const rect = useRef<Rect[]>(new Array(labels.length))

	const scrollInto = useCallback((index: number) => {
		const r = rect.current[index]
		const p = parentRef.current
		if (!r) {
			return
		}
		if (!p) {
			return
		}

		const delta = 40 // more than padding size
		const v0 = p.scrollLeft
		const v1 = p.scrollLeft + p.clientWidth
		const c0 = r.offsetLeft - p.offsetLeft - delta
		const c1 = r.offsetLeft - p.offsetLeft + r.clientWidth + delta

		if (v0 > c0) {
			p.scrollTo({ left: c0 })
		} else if (v1 < c1) {
			p.scrollTo({ left: v0 + (c1 - v1) })
		}
	}, [])

	useLayoutEffect(() => {
		const index = labels.findIndex(({ props: { to } }) => to === stateTo)
		scrollInto(index)
	}, [scrollInto, labels, stateTo])

	return (
		<div ref={parentRef} tw="pb-3 -mb-3 overflow-auto scroll-smooth">
			<ul tw="text-sm leading-none font-semibold flex whitespace-nowrap bg-transparent -mb-1 border-b">
				{labels.map(({ props: { to, title } }, i) => (
					<li key={indices[i]} tw="-mb-px">
						<Tab
							name={name}
							id={indices[i]}
							checked={to === stateTo || (i === 0 && notMatched)}
							onChange={() => {
								if (!propTo) {
									setTo(to)
								}
								onNavigate(to, undefined)
							}}
							ref={node => {
								if (node) {
									rect.current[i] = { offsetLeft: node.offsetLeft, clientWidth: node.clientWidth }
								}
							}}
							onClick={() => {
								scrollInto(i)
							}}
						>
							{title}
						</Tab>
					</li>
				))}
			</ul>
		</div>
	)
}

interface TabProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onClick"> {
	ref?: Ref<HTMLLabelElement>
	onClick?: MouseEventHandler<HTMLLabelElement>
}

function Tab({ className, children, ref, name, onClick, ...props }: TabProps) {
	return (
		<label className={className} ref={ref} onClick={onClick}>
			<input
				type="radio"
				tw="absolute left-0 top-0 w-0 h-0
					checked:[& ~ .tab]:text-foreground
					checked:[& ~ .tab::after]:(bg-primary translate-y-px scale-100 opacity-100)
					"
				{...props}
			/>
			<span
				className="tab"
				tw="select-none text-muted-foreground inline-block relative whitespace-nowrap capitalize transition cursor-pointer
					border-b
					px-4 pt-2 pb-3
					after:(translate-y-px h-[2px] absolute left-0 bottom-0 w-full transition-all duration-200 scale-0 opacity-0)
					hover:text-foreground
					"
			>
				{children}
			</span>
		</label>
	)
}
