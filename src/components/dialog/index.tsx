import { animated, easings, useSpringRef, useTransition } from "@react-spring/web"
import { Children, cloneElement, isValidElement, use, useEffect, useRef } from "react"
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
	lightDismiss?: boolean
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
		from: { opacity: 0.5, transform: "scale(0.98)" },
		enter: { opacity: 1, transform: "scale(1)" },
		leave: { opacity: 0, transform: "scale(0.98)" },
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
	onClickOutside?(): void
}

export function useDialog({ visible, lightDismiss, store }: DialogOptions & { store?: DialogStore } = {}) {
	const ref = useRef<DialogStore>(store)
	if (!ref.current) {
		ref.current = createDialogStore({ visible, lightDismiss })
	}
	return store ?? ref.current
}

export function Dialog({
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
		(e): e is React.ReactElement<React.ComponentProps<typeof DialogContent>> => isElement(e, DialogContent),
	)

	return (
		<DialogContext value={s}>
			{Children.map(children, child => {
				if (isElement(child, DialogContent)) {
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
