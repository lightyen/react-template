import {
	autoUpdate,
	flip,
	offset,
	shift,
	useDismiss,
	useFloating,
	useInteractions,
	useTransitionStyles,
	type Placement,
	type UseFloatingReturn,
} from "@floating-ui/react"
import { Children, cloneElement, createContext, isValidElement, use, useEffect, useMemo, useRef, useState } from "react"
import { FormattedMessage } from "~/i18n"
import { Button, type ButtonProps } from "./button"
import { composeRefs, isElement } from "./lib"

interface IPopover {
	visible: boolean
	setVisible(v: boolean): void
	onEnter(): void
	onLeave(): void
}

interface PopoverContext extends IPopover {
	isMounted: boolean
	refs: UseFloatingReturn["refs"]
	floatingStyles: UseFloatingReturn["floatingStyles"]
	getReferenceProps: ReturnType<typeof useInteractions>["getReferenceProps"]
	getFloatingProps: ReturnType<typeof useInteractions>["getFloatingProps"]
	styles: React.CSSProperties
}

const PopoverContext = createContext(null as unknown as PopoverContext)

interface PopoverTriggerProps extends Omit<ButtonProps, "onClick"> {
	mode?: "click" | "none"
}

export function PopoverTrigger({ children, mode = "click", ...props }: React.PropsWithChildren<PopoverTriggerProps>) {
	const { setVisible, refs, getReferenceProps } = use(PopoverContext)

	if (Children.count(children) > 1 && Children.toArray(children).every(isValidElement)) {
		return Children.map(children, c => <PopoverTrigger>{c}</PopoverTrigger>)
	}

	if (!isValidElement(children) || isElement(children, FormattedMessage)) {
		return (
			<Button
				ref={refs.setReference}
				{...getReferenceProps({
					onClick() {
						if (mode === "click") {
							setVisible(true)
						}
					},
				})}
			>
				{children}
			</Button>
		)
	}

	const child = children as React.ReactElement<
		React.HTMLAttributes<Element> & {
			ref?: React.Ref<Element>
		}
	>

	const innerProps = getReferenceProps({
		ref: composeRefs(refs.setReference, child.props.ref),
		onClick(e) {
			if (mode === "click") {
				setVisible(true)
			}
			child.props.onClick?.(e)
		},
	})

	const keys = Object.getOwnPropertyNames(child.props)
	for (const k of keys) {
		if (k === "ref") {
			continue
		}
		if (Object.prototype.hasOwnProperty.call(innerProps, k)) {
			const ch = child.props[k]
			const inner = innerProps[k]
			if (typeof ch === "function" && typeof inner === "function") {
				innerProps[k] = (...args: unknown[]) => {
					ch(...args)
					inner(...args)
				}
			}
		}
	}

	return cloneElement(child, {
		...props,
		...innerProps,
	})
}

interface PopoverContentProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
	children?: React.ReactNode | ((args: { close(): void }) => React.ReactNode)
}

export function PopoverContent({ children, ...props }: PopoverContentProps) {
	const { isMounted, refs, floatingStyles, getFloatingProps, styles, setVisible, visible, onEnter, onLeave } =
		use(PopoverContext)
	const onleave = useRef(onLeave)
	useEffect(() => {
		const onLeave = onleave.current
		return () => {
			if (isMounted) {
				onLeave()
			}
		}
	}, [isMounted])
	if (children == null) {
		return null
	}
	return (
		isMounted && (
			<div ref={refs.setFloating} style={{ ...floatingStyles, zIndex: 20 }} {...getFloatingProps()} {...props}>
				<div
					style={styles}
					onTransitionEnd={() => {
						if (visible) {
							onEnter()
						}
					}}
				>
					{typeof children === "function" ? children({ close: () => setVisible(false) }) : children}
				</div>
			</div>
		)
	)
}

export function PopoverClose({
	children,
	...props
}: React.PropsWithChildren<Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick">>) {
	const { setVisible } = use(PopoverContext)

	if (Children.count(children) > 1 && Children.toArray(children).every(isValidElement)) {
		return Children.map(children, c => <PopoverClose>{c}</PopoverClose>)
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

export function usePopover(initialState: boolean | (() => boolean) = false) {
	const [visible, setVisible] = useState(initialState)
	return { visible, setVisible }
}

interface PopoverProps {
	placement?: Placement
	visible?: boolean
	setVisible?(v: boolean | ((prev: boolean) => boolean)): void
	onEnter?(): void
	onLeave?(): void
}

export function Popover({
	children,
	placement = "bottom",
	visible,
	setVisible = () => void 0,
	onEnter = () => void 0,
	onLeave = () => void 0,
}: React.PropsWithChildren<PopoverProps>) {
	const [innerVisible, innerSetVisible] = useState(false)

	const ctx = useMemo<IPopover>(() => {
		if (visible == null) {
			return { visible: innerVisible, setVisible: innerSetVisible, onEnter, onLeave }
		}
		return { visible, setVisible, onEnter, onLeave }
	}, [innerVisible, visible, setVisible, onEnter, onLeave])

	const { refs, floatingStyles, context } = useFloating({
		open: ctx.visible,
		onOpenChange: ctx.setVisible,
		placement,

		middleware: [offset(5), shift({ padding: 8 }), flip()],
		whileElementsMounted: autoUpdate,
	})

	const dismiss = useDismiss(context, {
		referencePressEvent: "pointerdown",
		outsidePress: true,
	})
	const { getReferenceProps, getFloatingProps } = useInteractions([dismiss])
	const { isMounted, styles } = useTransitionStyles(context, {
		duration: { open: 180, close: 200 },
		common: ({ side }) => ({
			transitionTimingFunction: "cubic-bezier(0.33, 1, 0.68, 1)",
			zIndex: 50,
			transformOrigin: {
				top: "bottom",
				left: "right",
				bottom: "top",
				right: "left",
			}[side],
		}),
		initial: ({ side }) => ({
			opacity: 0,
			transform: {
				top: "translateY(5px) scale(0.9)",
				right: "translateX(-5px) scale(0.9)",
				bottom: "translateY(-5px) scale(0.9)",
				left: "translateX(5px) scale(0.9)",
			}[side],
		}),
		close: () => ({ opacity: 0 }),
	})
	return (
		<PopoverContext
			value={{
				...ctx,
				isMounted,
				refs,
				floatingStyles,
				getReferenceProps,
				getFloatingProps,
				styles,
			}}
		>
			{children}
		</PopoverContext>
	)
}
