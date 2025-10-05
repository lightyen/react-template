import { animated, easings, useSpringRef, useTransition } from "@react-spring/web"
import { Children, cloneElement, isValidElement, use, useEffect } from "react"
import { tw } from "twobj"
import { FormattedMessage } from "~/i18n"
import { Button, CloseButton, type ButtonProps } from "./button"
import { useDialog, type DialogProps } from "./dialog"
import { DialogContext } from "./dialog/context"
import { Overlay } from "./internal/overlay"
import { isElement, zs } from "./lib"

export const sheetVariants = zs(tw`fixed gap-4 bg-background p-6 shadow-lg`, {
	variants: {
		side: {
			top: tw`inset-x-0 top-0 border-b`,
			bottom: tw`inset-x-0 bottom-0 border-t`,
			left: tw`inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm`,
			right: tw`inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm`,
		},
	},
	defaultVariants: {
		side: "right",
	},
})

function animationVariants(side: "top" | "right" | "bottom" | "left") {
	const visible = { transform: "translateX(0%) translateY(0%)" }
	switch (side) {
		case "top":
			return {
				from: { transform: "translateX(0%) translateY(-100%)" },
				enter: visible,
				leave: { transform: "translateX(0%) translateY(-100%)" },
			}
		case "bottom":
			return {
				from: { transform: "translateX(0%) translateY(100%)" },
				enter: visible,
				leave: { transform: "translateX(0%) translateY(100%)" },
			}
		case "left":
			return {
				from: { transform: "translateX(-100%) translateY(0%)" },
				enter: visible,
				leave: { transform: "translateX(-100%) translateY(0%)" },
			}
		default:
			return {
				from: { transform: "translateX(100%) translateY(0%)" },
				enter: visible,
				leave: { transform: "translateX(100%) translateY(0%)" },
			}
	}
}

export const useSheet = useDialog

export function SheetTrigger({ children, ...props }: React.PropsWithChildren<Omit<ButtonProps, "onClick">>) {
	const store = use(DialogContext)
	const setVisible = store(state => state.setVisible)

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
SheetTrigger["$id"] = Symbol.for("com.SheetTrigger")

interface SheetContentProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
	side?: "top" | "right" | "bottom" | "left"
	lightDismiss?: boolean
	children?: React.ReactNode | ((args: { close(): void }) => React.ReactNode)
}

export function Div(props: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }) {
	return <div {...props} />
}

export function SheetContent({
	side = "right",
	onPointerDown = () => void 0,
	onPointerUp = () => void 0,
	onClick = () => void 0,
	children,
	...props
}: React.PropsWithChildren<SheetContentProps> & React.HTMLAttributes<HTMLDivElement>) {
	const store = use(DialogContext)
	const visible = store(state => state.visible)
	const setVisible = store(state => state.setVisible)
	const lightDismiss = store(state => state.lightDismiss)

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
	}, [lightDismiss, setVisible])

	const api = useSpringRef()
	const [transitions] = useTransition(visible, () => ({
		ref: api,
		config: { duration: 120, easing: easings.easeOutCubic },
		...animationVariants(side),
	}))

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

	return transitions((style, item) => {
		return (
			item && (
				<animated.div
					role="dialog"
					css={sheetVariants({ side })}
					style={style}
					onPointerDown={event => {
						event.stopPropagation()
						onPointerDown(event)
					}}
					onPointerUp={event => {
						event.stopPropagation()
						onPointerUp(event)
					}}
					onClick={event => {
						event.stopPropagation()
						onClick(event)
					}}
					{...props}
				>
					{typeof children === "function" ? children({ close: () => setVisible(false) }) : children}
					<SheetClose>
						<CloseButton tw="absolute right-4 top-4" />
					</SheetClose>
				</animated.div>
			)
		)
	})
}
SheetContent["$id"] = Symbol.for("com.SheetContent")

export function SheetClose({
	children,
	...props
}: React.PropsWithChildren<Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick">>) {
	const store = use(DialogContext)
	const setVisible = store(state => state.setVisible)

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
SheetClose["$id"] = Symbol.for("com.SheetClose")

export function SheetHeader({ children, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) {
	return (
		<div tw="flex flex-col space-y-2 text-center sm:text-left" {...props}>
			{children}
		</div>
	)
}
SheetHeader["$id"] = Symbol.for("com.SheetHeader")

export function SheetTitle({ children, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) {
	return (
		<div tw="text-lg font-semibold text-foreground" {...props}>
			{children}
		</div>
	)
}
SheetTitle["$id"] = Symbol.for("com.SheetTitle")

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
SheetDescription["$id"] = Symbol.for("com.SheetDescription")

export function SheetFooter({ children, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) {
	return (
		<div tw="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2" {...props}>
			{children}
		</div>
	)
}
SheetFooter["$id"] = Symbol.for("com.SheetFooter")

export function Sheet({
	visible,
	lightDismiss = true,
	store,
	blur,
	onClickOutside = () => void 0,
	children,
}: React.PropsWithChildren<DialogProps>) {
	const s = useDialog({ visible, lightDismiss, store })

	const _visible = s(state => state.visible)
	const _setVisible = s(state => state.setVisible)
	const _lightDismiss = s(state => state.lightDismiss)
	const _setLightDismiss = s(state => state.setLightDismiss)

	useEffect(() => {
		if (visible != null) {
			_setVisible(visible)
		}
	}, [visible, _setVisible])

	useEffect(() => {
		if (lightDismiss != null) {
			_setLightDismiss(lightDismiss)
		}
	}, [lightDismiss, _setLightDismiss])

	const contentReactElement = Children.toArray(children).find(
		(e): e is React.ReactElement<React.ComponentProps<typeof SheetContent>> => isElement(e, SheetContent),
	)
	return (
		<DialogContext value={s}>
			{Children.map(children, child => {
				if (isElement(child, SheetContent)) {
					return null
				}
				return child
			})}
			<Overlay
				visible={_visible}
				blur={blur}
				onClickOverlay={() => {
					onClickOutside()
					if (_lightDismiss) {
						_setVisible(false)
					}
				}}
			>
				{contentReactElement}
			</Overlay>
		</DialogContext>
	)
}
