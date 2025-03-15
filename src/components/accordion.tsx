import { css } from "@emotion/react"
import { ChevronDownIcon } from "@radix-ui/react-icons"
import {
	Children,
	cloneElement,
	createContext,
	useContext,
	useLayoutEffect,
	useMemo,
	useRef,
	useSyncExternalStore,
} from "react"
import { tw } from "twobj"
import { getElementHeight, isElement } from "./lib"

interface IndexProp {
	index?: number
}

interface AccordionContextItem {
	open: boolean
}

interface AccordionContext {
	items: AccordionContextItem[]
	toggle(i: number): void
}

const AccordionContext = createContext(null as unknown as AccordionContext)

interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
	type?: "single" | "multiple"
}

interface Snapshot {
	nodes: React.ReactNode[]
	items: AccordionContextItem[]
	setItems(cb: (items: AccordionContextItem[]) => AccordionContextItem[]): void
}

function createStore(children: React.ReactNode | React.ReactNode[]) {
	const listeners: Array<() => void> = []

	const nodes = Children.toArray(children)
		.filter((e): e is React.ReactElement<React.ComponentProps<typeof AccordionItem>> => isElement(e, AccordionItem))
		.map((e, index) => cloneElement(e, { index }))

	let state: Snapshot = {
		nodes: nodes,
		items: nodes.map(() => ({ open: false })),
		setItems,
	}

	return {
		subscribe(onStoreChange: () => void) {
			listeners.push(onStoreChange)
			return () => {
				listeners.filter(v => v !== onStoreChange)
			}
		},
		getSnapshot(): Snapshot {
			return state
		},
	}

	function setItems(cb: (items: AccordionContextItem[]) => AccordionContextItem[]) {
		state = {
			...state,
			items: cb(state.items),
		}
		for (const listener of listeners) {
			listener()
		}
	}
}

export function Accordion({ type = "single", children, ...props }: React.PropsWithChildren<AccordionProps>) {
	const store = useRef(createStore(children))

	const { nodes, items, setItems } = useSyncExternalStore(store.current.subscribe, store.current.getSnapshot)

	if (nodes.length !== items.length) {
		return null
	}

	return (
		<AccordionContext
			value={{
				toggle(index) {
					if (type === "single") {
						setItems(s => {
							const arr = s.slice()
							for (let i = 0; i < arr.length; i++) {
								if (index === i) {
									arr[i].open = !arr[i].open
								} else {
									arr[i].open = false
								}
							}
							return arr
						})
					} else {
						setItems(s => {
							const arr = s.slice()
							arr[index].open = !arr[index].open
							return arr
						})
					}
					return
				},
				items,
			}}
		>
			<div {...props}>{nodes}</div>
		</AccordionContext>
	)
}

interface AccordionItemProps extends IndexProp {
	position?: "relative" | "absolute"
}

export function AccordionItem({
	children,
	index = -1,
	position = "relative",
}: React.PropsWithChildren<AccordionItemProps>) {
	const ref = useRef<HTMLElement>(null)
	const { items } = useContext(AccordionContext)
	useLayoutEffect(() => {
		if (position === "absolute") {
			if (ref.current) {
				const el = ref.current
				const h = el.offsetHeight
				el.style.setProperty("--accordion-item-height", h + "px")
			}
		}
	}, [position])

	const { trigger, content } = useMemo(() => {
		const array = Children.toArray(children)
		const triggerElement = array.find((e): e is React.ReactElement<React.ComponentProps<typeof AccordionTrigger>> =>
			isElement(e, AccordionTrigger),
		)
		const contentElement = array.find((e): e is React.ReactElement<React.ComponentProps<typeof AccordionTrigger>> =>
			isElement(e, AccordionContent),
		)
		return {
			trigger: triggerElement && cloneElement(triggerElement, { index }),
			content: contentElement && cloneElement(contentElement),
		}
	}, [index, children])

	return (
		<section
			ref={ref}
			tw="relative z-10 border-b"
			css={[
				css`
					z-index: ${items.length - index};
				`,
				position === "absolute" && tw`h-[var(--accordion-item-height)]`,
			]}
		>
			{trigger}
			{content}
		</section>
	)
}
AccordionItem["$id"] = Symbol.for("com.AccordionItem")

interface AccordionTriggerProps extends IndexProp {}

export function AccordionTrigger({ index = -1, children }: React.PropsWithChildren<AccordionTriggerProps>) {
	const { toggle, items } = useContext(AccordionContext)
	return (
		<button
			type="button"
			tw="px-1
				w-full flex items-center justify-between py-4 text-sm font-medium hover:underline
				[&[data-state=open] + div]:h-[var(--accordion-content-height)]
				[& > svg]:(duration-200 h-4 w-4 text-muted-foreground)
				[&[data-state=open] > svg]:rotate-180
			"
			data-state={items[index].open ? "open" : "closed"}
			onClick={() => {
				toggle(index)
			}}
		>
			{children}
			<ChevronDownIcon />
		</button>
	)
}
AccordionTrigger["$id"] = Symbol.for("com.AccordionTrigger")

export function AccordionContent({ children, ...props }: React.PropsWithChildren) {
	const ref = useRef<HTMLDivElement>(null)
	useLayoutEffect(() => {
		if (ref.current) {
			const el = ref.current
			el.style.setProperty("--accordion-content-height", getElementHeight(el) + "px")
		}
	}, [])
	return (
		<div ref={ref} tw="px-1 transition-[height] overflow-hidden h-0 text-sm [& > div]:(bg-background pb-4)">
			<div {...props}>{children}</div>
		</div>
	)
}
