import {
	useCallback,
	useLayoutEffect,
	useMemo,
	useRef,
	type InputHTMLAttributes,
	type MouseEventHandler,
	type ReactNode,
	type Ref,
} from "react"
import { resolvePath, useLocation, useNavigate, type Location, type To } from "react-router"

export interface RouteTabItem {
	to: To
	title: ReactNode
	index?: boolean
}

export interface RouteTabsProps {
	labels: RouteTabItem[]
}

export function RouteTabs({ labels }: RouteTabsProps) {
	const location = useLocation()

	const navigate = useNavigate()

	function equalPath(location: Location, to: To): boolean {
		const { pathname } = location
		const p = pathname.slice(pathname.lastIndexOf("/"))
		return resolvePath(to).pathname === p
	}

	const index = useMemo(() => {
		const i = labels.findIndex(({ to }) => equalPath(location, to))
		if (i !== -1) {
			return i
		}
		return labels.findIndex(({ index }) => index)
	}, [location, labels])

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
		scrollInto(index)
	}, [scrollInto, index])

	return (
		<div ref={parentRef} tw="pb-3 -mb-3 overflow-auto scroll-smooth">
			<div tw="text-sm leading-none font-semibold flex whitespace-nowrap bg-transparent -mb-1 border-b">
				{labels.map(({ to, title }, i) => (
					<Tab
						key={i}
						tw="-mb-px"
						checked={index === i}
						onChange={() => {
							navigate(to)
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
				))}
			</div>
		</div>
	)
}

interface TabProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onClick"> {
	onClick?: MouseEventHandler<HTMLLabelElement>
	ref?: Ref<HTMLLabelElement>
}

function Tab({ className, children, ref, onClick, ...props }: TabProps) {
	return (
		<label className={className} onClick={onClick} ref={ref}>
			<input
				type="checkbox"
				tw="absolute left-0 top-0 w-0 h-0
					checked:[& ~ .tab]:text-foreground
					checked:[& ~ .tab::after]:(bg-primary translate-y-px scale-100 opacity-100)
					focus-visible:[& ~ .tab]:(bg-foreground/10)
					"
				{...props}
			/>
			<span
				className="tab"
				tw="select-none text-muted-foreground inline-block relative whitespace-nowrap capitalize transition cursor-pointer
					px-4 pt-2.5 pb-3 border-b
					after:(translate-y-px h-[2px] absolute left-0 bottom-0 w-full transition-all duration-200 scale-0 opacity-0)
					hover:text-foreground
					"
			>
				{children}
			</span>
		</label>
	)
}
