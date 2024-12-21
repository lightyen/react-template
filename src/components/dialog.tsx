import { animated, easings, useSpringRef, useTransition } from "@react-spring/web"
import { Children, cloneElement, isValidElement, useContext, useEffect, useMemo, useState } from "react"
import { FormattedMessage } from "react-intl"
import { tw } from "twobj"
import { Button, CloseButton, type ButtonProps } from "./button"
import { DialogContext } from "./internal/dialogContext"
import { Overlay } from "./internal/overlay"
import { isElement } from "./lib"

export function useDialog(initialState: boolean | (() => boolean) = false) {
	const [visible, setVisible] = useState(initialState)
	return { visible, setVisible }
}

export function DialogTrigger({ children, ...props }: React.PropsWithChildren<Omit<ButtonProps, "onClick">>) {
	const { setVisible } = useContext(DialogContext)

	if (Children.count(children) > 1 && Children.toArray(children).every(isValidElement)) {
		return Children.map(children, c => <DialogTrigger>{c}</DialogTrigger>)
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
		onClick(e) {
			setVisible(true)
			child.props.onClick?.(e)
		},
	})
}

interface DialogContentProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
	layout?: boolean | "false"
	children?: React.ReactNode | ((args: { close(): void }) => React.ReactNode)
}

export function DialogContent({
	layout = true,
	onPointerDown = () => void 0,
	onPointerUp = () => void 0,
	onClick = () => void 0,
	children,
	...props
}: DialogContentProps) {
	const { visible, setVisible } = useContext(DialogContext)

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

	const [transitions] = useTransition(visible, () => ({
		ref: api,
		from: { opacity: 0.5, transform: "scale(0.98) translateX(-50%) translateY(-50%)" },
		enter: { opacity: 1, transform: "scale(1) translateX(-50%) translateY(-50%)" },
		leave: { opacity: 0, transform: "scale(0.98) translateX(-50%) translateY(-50%)" },
		config: { duration: 120, easing: easings.easeOutCubic },
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

	return transitions((s, item) => {
		return (
			item && (
				<animated.div
					role="dialog"
					{...props}
					style={s}
					tw="absolute left-[50%] top-[50%] shadow-lg origin-center sm:(rounded-lg w-full)"
					css={
						layout === true &&
						tw`grid gap-4 border bg-background p-6 w-full max-w-lg sm:max-w-[var(--dialog-width)]`
					}
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
				>
					{typeof children === "function" ? children({ close: () => setVisible(false) }) : children}
					<DialogClose>
						<CloseButton tw="absolute right-4 top-4" />
					</DialogClose>
				</animated.div>
			)
		)
	})
}
DialogContent["$id"] = Symbol.for("com.DialogContent")

export function DialogClose({
	children,
	...props
}: React.PropsWithChildren<Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick">>) {
	const { setVisible } = useContext(DialogContext)

	if (Children.count(children) > 1 && Children.toArray(children).every(isValidElement)) {
		return Children.map(children, c => <DialogClose>{c}</DialogClose>)
	}

	if (!isValidElement(children) || isElement(children, FormattedMessage)) {
		return (
			<button
				type="button"
				tw="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity
					hover:opacity-100
					focus:(outline-none ring-2 ring-ring ring-offset-2)
					disabled:pointer-events-none"
				{...props}
				onClick={() => setVisible(false)}
			>
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
DialogClose["$id"] = Symbol.for("com.DialogClose")

export function DialogHeader({ children, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) {
	return (
		<div tw="flex flex-col space-y-1.5 text-center sm:text-left" {...props}>
			{children}
		</div>
	)
}
DialogHeader["$id"] = Symbol.for("com.DialogHeader")

export function DialogTitle({ children, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) {
	return (
		<div tw="text-lg font-semibold leading-none tracking-tight" {...props}>
			{children}
		</div>
	)
}
DialogTitle["$id"] = Symbol.for("com.DialogTitle")

export function DialogDescription({
	children,
	...props
}: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) {
	return (
		<div tw="text-sm text-muted-foreground" {...props}>
			{children}
		</div>
	)
}
DialogDescription["$id"] = Symbol.for("com.DialogDescription")

export function DialogFooter({ children, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) {
	return (
		<div tw="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2" {...props}>
			{children}
		</div>
	)
}
DialogFooter["$id"] = Symbol.for("com.DialogFooter")

export interface DialogProps {
	visible?: boolean
	setVisible?(v: boolean | ((prev: boolean) => boolean)): void

	/** @default true */
	blur?: boolean
	/** @default true */
	overlayExit?: boolean

	onClickOverlay?(): void
}

export function Dialog({
	visible,
	setVisible = () => void 0,
	blur,
	overlayExit = true,
	onClickOverlay = () => void 0,
	children,
}: React.PropsWithChildren<DialogProps>) {
	const [innerVisible, innerSetVisible] = useState(false)

	const ctx = useMemo(() => {
		if (visible == null) {
			return { visible: innerVisible, setVisible: innerSetVisible }
		}
		return { visible, setVisible }
	}, [innerVisible, visible, setVisible])

	const contentReactElement = Children.toArray(children).find(
		(e): e is React.ReactElement<React.ComponentProps<typeof DialogContent>> => isElement(e, DialogContent),
	)

	return (
		<DialogContext value={ctx}>
			{Children.map(children, child => {
				if (isElement(child, DialogContent)) {
					return null
				}
				return child
			})}
			<Overlay
				visible={ctx.visible}
				blur={blur}
				onClickOverlay={() => {
					onClickOverlay()
					if (overlayExit === true) {
						ctx.setVisible(false)
					}
				}}
			>
				{contentReactElement}
			</Overlay>
		</DialogContext>
	)
}
