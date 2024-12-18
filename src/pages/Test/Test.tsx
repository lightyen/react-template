import { animated, easings, useSprings } from "@react-spring/web"
import { useWindowVirtualizer } from "@tanstack/react-virtual"
import { useDrag } from "@use-gesture/react"
import { createContext, useContext, useRef, useState } from "react"
import "react-day-picker/style.css"
import { create } from "zustand"
import { immer } from "zustand/middleware/immer"
import { Button } from "~/components/button"
import { addresses } from "~/data/macaddr"
import { TodoList } from "./Todolist"

function DragExample() {
	const [springs, springApi] = useSprings(1, () => ({
		x: 0,
		y: 0,
		config: { duration: 120, easing: easings.easeOutExpo },
	}))

	// Set the drag hook and define component movement based on gesture data.
	const [dragging, setDragging] = useState(false)

	const gestures = useDrag(({ down, movement: [_mx, my] }) => {
		let y = my
		if (!down || y < 0) {
			y = 0
		} else if (y > 300) {
			y = 300
		}
		setDragging(down)
		springApi.start({ y })
	})

	// Bind it to a component.
	return springs.map((style, i) => (
		<AnimatedItem
			key={i}
			style={{ ...style, cursor: dragging ? "grabbing" : "grab", touchAction: "none" }}
			{...gestures()}
		>
			<div tw="p-3 select-none text-primary-foreground">Content</div>
		</AnimatedItem>
	))
}

function AnimatedItem({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<animated.div tw="bg-primary" {...props}>
			{children}
		</animated.div>
	)
}

export function Component() {
	return (
		<article tw="relative">
			<div>
				<h1 tw="border-b mb-4">Test</h1>
				<div tw="bg-accent/50 p-2 max-w-[600px] flex gap-5 justify-end">
					<Button variant="outline" size="sm" tw="flex-1 sm:max-w-[130px]">
						Cancel
					</Button>
					<Button variant="outline" size="sm" tw="flex-1 sm:max-w-[130px]">
						Submit
					</Button>
				</div>
				<div tw="relative p-4">
					<DragExample />
				</div>
				<div tw="max-w-lg">
					<TodoList />
				</div>
			</div>
			<Demo />
			<LongList />
		</article>
	)
}

interface BearState {
	bears: number
	increase: (by: number) => void
}

type Store = ReturnType<typeof createStore>

function createStore() {
	return create<BearState>()(
		immer(set => ({
			bears: 0,
			increase(by) {
				set(state => {
					state.bears += by
				})
			},
		})),
	)
}

const StoreContext = createContext<Store>(null as unknown as Store)

function StoreProvider({ children }) {
	const storeRef = useRef<Store>(undefined)
	if (!storeRef.current) {
		storeRef.current = createStore()
	}
	return <StoreContext value={storeRef.current}>{children}</StoreContext>
}

function Demo() {
	return (
		<>
			<StoreProvider>
				<DemoBox></DemoBox>
			</StoreProvider>
			<StoreProvider>
				<DemoBox></DemoBox>
			</StoreProvider>
		</>
	)
}

function DemoBox() {
	const useStore = useContext(StoreContext)
	const bears = useStore(state => state.bears)
	const increase = useStore(state => state.increase)
	return <div onClick={() => increase(1)}>{bears}</div>
}

function LongList() {
	const listRef = useRef<HTMLDivElement | null>(null)
	const virtualizer = useWindowVirtualizer({
		count: addresses.length,
		estimateSize: () => 32,
		overscan: 5,
		scrollMargin: listRef.current?.offsetTop ?? 0,
	})
	return (
		<div
			ref={listRef}
			tw="relative"
			style={{
				height: `${virtualizer.getTotalSize()}px`,
			}}
		>
			{virtualizer.getVirtualItems().map(({ key, index, size, start }) => (
				<div
					key={key}
					tw="absolute top-0 left-0 w-full flex items-center"
					style={{
						height: `${size}px`,
						transform: `translateY(${start - virtualizer.options.scrollMargin}px)`,
					}}
				>
					{addresses[index]}
				</div>
			))}
		</div>
	)
}
