import { animated, useSpringRef, useTransition } from "@react-spring/web"
import BezierEasing from "bezier-easing"
import { Children, cloneElement, isValidElement, use, useCallback, useEffect, useRef } from "react"
import { Button, CloseButton, type ButtonProps } from "~/components/button"
import { Overlay } from "~/components/internal/overlay"
import { isElement } from "~/components/lib"
import { FormattedMessage } from "~/i18n"
import { createDialogStore, DialogContext, DialogOptions, DialogStore } from "./context"

export function DialogTrigger({ children, ...props }: React.PropsWithChildren<Omit<ButtonProps, "onClick">>) {
	const store = use(DialogContext)
	const setVisible = store(state => state.setVisible)

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
	/** @default 525px */
	maxWidth?: string | number
	children?: React.ReactNode | ((args: { close(): void }) => React.ReactNode)
}

export function DialogContent({
	maxWidth = 525,
	onPointerDown = () => void 0,
	onPointerUp = () => void 0,
	onClick = () => void 0,
	children,
	...props
}: DialogContentProps) {
	const store = use(DialogContext)
	const visible = store(state => state.visible)
	const setVisible = store(state => state.setVisible)

	const api = useSpringRef()

	const [transitions] = useTransition(visible, () => ({
		ref: api,
		from: { opacity: 0.5, transform: "translateY(6px)" },
		enter: { opacity: 1, transform: "translateY(0)" },
		leave: { opacity: 0, transform: "translateY(0)" },
		config: { duration: 150, easing: BezierEasing(0.4, 0, 0.33, 1) },
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
					tw="origin-center grid place-content-center place-items-center"
					style={style}
				>
					<div
						tw="relative shadow-lg w-[calc(100vw - 0.75rem)] sm:rounded-lg overflow-auto
							h-[min(100%, calc(100dvh - 2.5rem))]
							[@media (min-height: 800px)]:h-[min(100%, calc(100dvh - 10rem))]
							bg-background p-6
						"
						css={{ maxWidth }}
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
						<DialogClose>
							<CloseButton tw="absolute right-4 top-4" />
						</DialogClose>
					</div>
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
	const store = use(DialogContext)
	const setVisible = store(state => state.setVisible)

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
		<div tw="mb-3 flex flex-col space-y-1.5 text-center sm:text-left" {...props}>
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
	// setVisible?(v: boolean | ((prev: boolean) => boolean)): void
	store?: DialogStore

	/** @default true */
	blur?: boolean
	/** @default true */
	lightDismiss?: boolean
	onLightDismiss?(): void
	onDestroyed?(end: boolean): void
}

export function useDialog({ visible, store }: DialogOptions & { store?: DialogStore } = {}) {
	const ref = useRef<DialogStore>(store)
	if (!ref.current) {
		ref.current = createDialogStore({ visible })
	}
	return store ?? ref.current
}

export function Dialog({
	store,
	blur,
	lightDismiss = true,
	onLightDismiss = () => void 0,
	onDestroyed,
	children,
	...props
}: React.PropsWithChildren<DialogProps>) {
	const ref = useRef<ReturnType<typeof createDialogStore>>(store)
	if (!ref.current) {
		ref.current = createDialogStore({ visible: props.visible })
	}
	const select = ref.current
	const visible = select(state => state.visible)
	const setVisible = select(state => state.setVisible)

	useEffect(() => {
		if (typeof props.visible === "boolean") {
			setVisible(props.visible)
		}
	}, [setVisible, props.visible])

	const handleEscape = useCallback(() => {
		if (props.visible != null && visible && lightDismiss) {
			setVisible(false)
			onLightDismiss()
		}
	}, [setVisible, onLightDismiss, lightDismiss, visible, props.visible])

	useEffect(() => {
		function handle(e: KeyboardEvent) {
			if (e.key === "Escape") {
				handleEscape()
			}
		}
		window.addEventListener("keydown", handle)
		return () => {
			window.removeEventListener("keydown", handle)
		}
	}, [handleEscape])

	const contentReactElement = Children.toArray(children).find(
		(e): e is React.ReactElement<React.ComponentProps<typeof DialogContent>> => isElement(e, DialogContent),
	)

	return (
		<DialogContext value={select}>
			{Children.map(children, child => {
				if (isElement(child, DialogContent)) {
					return null
				}
				return child
			})}
			<Overlay
				visible={props.visible ?? visible}
				blur={blur}
				onDestroyed={onDestroyed}
				onClickOverlay={() => {
					if (props.visible == null) {
						if (lightDismiss && visible) {
							setVisible(false)
							onLightDismiss()
						}
					}
				}}
			>
				{contentReactElement}
			</Overlay>
		</DialogContext>
	)
}
