import { Button } from "@components/button"
import { getElementWidth, isElement, zs } from "@components/lib"
import { dialogContext } from "@components/lib/dialogContext"
import { Overlay } from "@components/overlay"
import { animated, useSpringRef, useTransition } from "@react-spring/web"
import { useDrag } from "@use-gesture/react"
import {
	Children,
	cloneElement,
	isValidElement,
	useContext,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
	type ButtonHTMLAttributes,
	type ComponentProps,
	type DetailedReactHTMLElement,
	type HTMLAttributes,
	type PropsWithChildren,
	type ReactElement,
	type ReactNode,
} from "react"
import { FormattedMessage } from "react-intl"
import { tw } from "twobj"

export function SheetTrigger({
	children,
	...props
}: PropsWithChildren<Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick">>) {
	const { setVisible } = useContext(dialogContext)

	if (Children.count(children) > 1 && Children.toArray(children).every(isValidElement)) {
		return Children.map(children, c => <SheetTrigger>{c}</SheetTrigger>)
	}

	if (!isValidElement(children) || isElement(children, FormattedMessage)) {
		return (
			<Button {...props} onClick={() => setVisible(true)}>
				{children}
			</Button>
		)
	}

	const child = children as DetailedReactHTMLElement<HTMLAttributes<HTMLElement>, HTMLElement>

	return cloneElement(child, {
		...props,
		onClick: e => {
			setVisible(true)
			child.props.onClick?.(e)
		},
	})
}

export const sheetVariants = zs(tw`fixed gap-4 bg-background p-6 shadow-lg`, {
	variants: {
		side: {
			top: tw`inset-x-0 top-0 border-b`,
			bottom: tw`inset-x-0 bottom-0 border-t`,
			left: tw`inset-y-0 left-0 h-auto mt-3 mb-10 w-3/5 border border-l-0 rounded-r-2xl sm:max-w-sm`,
			right: tw`inset-y-0 right-0 h-full w-3/5 border-l sm:max-w-sm`,
		},
	},
	defaultVariants: {
		side: "right",
	},
})

interface SheetContentProps {
	children?: ReactNode | ((args: { close(): void }) => ReactNode)
}

export function SheetContent({
	onClick = () => void 0,
	children,
	...props
}: SheetContentProps & HTMLAttributes<HTMLDivElement>) {
	const { visible, setVisible } = useContext(dialogContext)

	useEffect(() => {
		function handle(e: KeyboardEvent) {
			if (e.key === "Escape") {
				setVisible(false)
			}
		}
		window.addEventListener("keydown", handle)
		return () => {
			window.removeEventListener("keydown", handle)
		}
	}, [setVisible])

	const api = useSpringRef()
	const [transitions] = useTransition(visible, () => {
		const enter = { transform: `translateX(0%)` }
		const leave = { transform: `translateX(-80%)` }
		const from = { transform: `translateX(-80%)` }
		return {
			ref: api,
			from,
			enter,
			leave,
		}
	})

	const ref = useRef<HTMLDivElement>(null)
	const width = useRef(0)
	useLayoutEffect(() => {
		if (ref.current) {
			const el = ref.current
			const w = getElementWidth(el)
			width.current = w
		}
	}, [api])

	const gestures = useDrag(({ event, down, movement: [mx, _my] }) => {
		event.stopPropagation()
		if (!width.current) {
			return
		}
		let x = mx
		if (x > 0) {
			x = 0
		} else if (!down) {
			x = 0
			if (mx < -72) {
				setVisible(false)
			}
		}
		const ratio = x / width.current
		api.start({ opacity: 1 + ratio + 0.5, transform: `translateX(calc(${100 * ratio}%))` })
	})

	useEffect(() => {
		if (visible) {
			api.start()
		}
		return () => {
			if (visible) {
				api.start()
			}
		}
	}, [visible, api])

	if (children == null) {
		return null
	}

	console.log(gestures())

	return transitions((style, item) => {
		return (
			item && (
				<animated.div
					ref={ref}
					role="dialog"
					css={sheetVariants({ side: "left" })}
					style={{ ...style, touchAction: "none" }}
					onClick={event => {
						event.stopPropagation()
						onClick(event)
					}}
					{...gestures()}
					{...props}
				>
					{typeof children === "function" ? children({ close }) : children}
				</animated.div>
			)
		)
	})
}

export function SheetClose({
	children,
	...props
}: PropsWithChildren<Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick">>) {
	const { setVisible } = useContext(dialogContext)

	if (Children.count(children) > 1 && Children.toArray(children).every(isValidElement)) {
		return Children.map(children, c => <SheetClose>{c}</SheetClose>)
	}

	if (!isValidElement(children) || isElement(children, FormattedMessage)) {
		return (
			<button type="button" {...props} onClick={() => setVisible(false)}>
				{children}
			</button>
		)
	}

	const child = children as DetailedReactHTMLElement<HTMLAttributes<HTMLElement>, HTMLElement>

	return cloneElement(child, {
		onClick: e => {
			setVisible(false)
			child.props.onClick?.(e)
		},
	})
}

export function SheetHeader({ children, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
	return (
		<div tw="flex flex-col space-y-2 text-center sm:text-left" {...props}>
			{children}
		</div>
	)
}

export function SheetTitle({ children, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
	return (
		<div tw="text-lg font-semibold text-foreground" {...props}>
			{children}
		</div>
	)
}

export function SheetDescription({ children, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
	return (
		<div tw="text-sm text-muted-foreground" {...props}>
			{children}
		</div>
	)
}

export function SheetFooter({ children, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
	return (
		<div tw="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2" {...props}>
			{children}
		</div>
	)
}

export interface SheetProps {
	/** @default true */
	blur?: boolean
	/** @default true */
	overlayExit?: boolean
	onClickOverlay?(): void
}

export function Sheet({
	blur,
	overlayExit = true,
	onClickOverlay = () => void 0,
	children,
}: PropsWithChildren<SheetProps>) {
	const [visible, setVisible] = useState(false)
	const contentReactElement = Children.toArray(children).find(
		(e): e is ReactElement<ComponentProps<typeof SheetContent>> => isElement(e, SheetContent),
	)

	return (
		<dialogContext.Provider value={{ visible, setVisible }}>
			{Children.map(children, c => {
				if (isElement(c, SheetTrigger)) {
					return c
				}
				return null
			})}
			<Overlay
				visible={visible}
				blur={blur}
				onClickOverlay={() => {
					onClickOverlay()
					if (overlayExit === true) {
						setVisible(false)
					}
				}}
			>
				{contentReactElement}
			</Overlay>
		</dialogContext.Provider>
	)
}
