import { animated, useSpringRef, useTransition } from "@react-spring/web"
import { useDrag } from "@use-gesture/react"
import { Children, cloneElement, isValidElement, useContext, useEffect, useLayoutEffect, useRef, useState } from "react"
import { tw } from "twobj"
import { Button } from "~/components/button"
import { DialogContext } from "~/components/internal/dialogContext"
import { Overlay } from "~/components/internal/overlay"
import { getElementWidth, isElement, zs } from "~/components/lib"
import { FormattedMessage } from "~/react-intl"

export function SheetTrigger({
	children,
	...props
}: React.PropsWithChildren<Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick">>) {
	const { setVisible } = useContext(DialogContext)

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

	const child = children as React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>

	return cloneElement(child, {
		...props,
		onClick: e => {
			setVisible(true)
			child.props.onClick?.(e)
		},
	})
}
SheetTrigger["$id"] = Symbol.for("nav.SheetTrigger")

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
	children?: React.ReactNode | ((args: { close(): void }) => React.ReactNode)
}

export function SheetContent({
	onClick = () => void 0,
	children,
	...props
}: SheetContentProps & React.HTMLAttributes<HTMLDivElement>) {
	const { visible, setVisible, lightDismiss } = useContext(DialogContext)

	useEffect(() => {
		function handle(e: KeyboardEvent) {
			if (e.key === "Escape") {
				setVisible(false)
			}
		}
		if (lightDismiss) {
			window.addEventListener("keydown", handle)
		}
		return () => {
			if (lightDismiss) {
				window.removeEventListener("keydown", handle)
			}
		}
	}, [setVisible, lightDismiss])

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
SheetContent["$id"] = Symbol.for("nav.SheetContent")

export function SheetClose({
	children,
	...props
}: React.PropsWithChildren<Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick">>) {
	const { setVisible } = useContext(DialogContext)

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

	const child = children as React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>

	return cloneElement(child, {
		onClick: e => {
			setVisible(false)
			child.props.onClick?.(e)
		},
	})
}
SheetClose["$id"] = Symbol.for("nav.SheetClose")

export function SheetHeader({ children, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) {
	return (
		<div tw="flex flex-col space-y-2 text-center sm:text-left" {...props}>
			{children}
		</div>
	)
}
SheetHeader["$id"] = Symbol.for("nav.SheetHeader")

export function SheetTitle({ children, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) {
	return (
		<div tw="text-lg font-semibold text-foreground" {...props}>
			{children}
		</div>
	)
}
SheetTitle["$id"] = Symbol.for("nav.SheetTitle")

export function SheetDescription({
	children,
	...props
}: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) {
	return (
		<div tw="text-sm text-muted-foreground" {...props}>
			{children}
		</div>
	)
}
SheetDescription["$id"] = Symbol.for("nav.SheetDescription")

export function SheetFooter({ children, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) {
	return (
		<div tw="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2" {...props}>
			{children}
		</div>
	)
}
SheetFooter["$id"] = Symbol.for("nav.SheetFooter")

export interface SheetProps {
	/** @default true */
	blur?: boolean
	/** @default true */
	lightDismiss?: boolean
	onClickOutside?(): void
}

export function Sheet({
	blur,
	lightDismiss = true,
	onClickOutside = () => void 0,
	children,
}: React.PropsWithChildren<SheetProps>) {
	const [visible, setVisible] = useState(false)
	const contentReactElement = Children.toArray(children).find(
		(e): e is React.ReactElement<React.ComponentProps<typeof SheetContent>> => isElement(e, SheetContent),
	)

	return (
		<DialogContext value={{ visible, setVisible, lightDismiss }}>
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
					onClickOutside()
					if (lightDismiss === true) {
						setVisible(false)
					}
				}}
			>
				{contentReactElement}
			</Overlay>
		</DialogContext>
	)
}
