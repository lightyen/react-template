import { useAction, useSelect } from "@context"
import { Cross2Icon } from "@radix-ui/react-icons"
import { animated, easings, useSpringRef, useTransition } from "@react-spring/web"
import cx from "clsx"
import {
	Children,
	cloneElement,
	isValidElement,
	useEffect,
	useMemo,
	type DetailedReactHTMLElement,
	type HTMLAttributes,
	type PropsWithChildren,
} from "react"
import { FormattedMessage, useIntl } from "react-intl"
import { tw } from "twobj"
import { type InnerToasterToast } from "~/context/app/action"
import { isElement, zs } from "./lib"

const toastVariants = zs(
	tw`pointer-events-auto touch-none transition-colors
	relative flex w-full items-center justify-between space-x-2 overflow-hidden rounded-md border
	p-4 pr-6 shadow-lg
	`,
	{
		variants: {
			variant: {
				default: tw`border bg-background text-foreground`,
				destructive: tw`border-destructive bg-destructive text-destructive-foreground`,
				primary: tw`bg-background border-primary`,
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
)

export function Toaster() {
	const { removeAllToast } = useAction().app
	useEffect(() => {
		return () => {
			removeAllToast()
		}
	}, [removeAllToast])
	return (
		<div
			id="toaster"
			tw="fixed top-0 z-50 max-h-screen w-full p-4 pointer-events-none sm:(right-0 bottom-0 top-auto) md:max-w-[420px]"
		>
			<div tw="relative flex flex-col-reverse sm:flex-col">
				<Toasts />
			</div>
		</div>
	)
}

function ToastTitle({ children, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
	return (
		<div tw="text-base font-semibold [&+div]:text-sm" {...props}>
			{children}
		</div>
	)
}

function ToastDescription({ children, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
	return (
		<div tw="text-sm opacity-90" {...props}>
			{children}
		</div>
	)
}

function CloseButton({ onClick, className }: { onClick?(): void; className?: string }) {
	const intl = useIntl()
	return (
		<button
			type="button"
			tw="p-0.5 rounded-sm opacity-70 ring-offset-background transition duration-150
			hover:(opacity-100 bg-accent text-accent-foreground)
			focus:outline-none
			disabled:pointer-events-none
			group-hover:opacity-100
			group-[.destructive]:(text-red-300 hover:(text-accent bg-accent-foreground) focus:(ring-red-400 ring-offset-red-600))
			"
			onClick={onClick}
			className={className}
			title={intl.formatMessage({ id: "close" })}
		>
			<Cross2Icon tw="h-5 w-5" />
			<span tw="sr-only">
				<FormattedMessage id="close" />
			</span>
		</button>
	)
}

function ToastAction({ children, id }: PropsWithChildren<{ id: string }>) {
	const { dismissToast } = useAction().app
	if (Children.count(children) > 1 && Children.toArray(children).every(isValidElement)) {
		return Children.map(children, child => <ToastAction id={id}>{child}</ToastAction>)
	}

	if (!isValidElement(children) || isElement(children, FormattedMessage)) {
		return (
			<button
				type="button"
				tw="inline-flex shrink-0 items-center justify-center rounded-md bg-transparent
			px-3 h-[34px] font-semibold transition-colors
			hover:bg-secondary focus:(outline-none ring-1 ring-ring) disabled:(pointer-events-none opacity-50)
			group-[.destructive]:(
				border border-muted/30
				hover:(border-accent-foreground text-accent bg-accent-foreground)
				focus:ring-destructive
			)
			group-[.primary]:(
				// border-muted
				hover:(bg-accent text-accent-foreground)
				// hover:(border-muted/30 bg-primary text-primary-foreground)
				focus:ring-primary
			)"
				onClick={() => dismissToast(id)}
			>
				{children}
			</button>
		)
	}

	const child = children as DetailedReactHTMLElement<HTMLAttributes<HTMLElement>, HTMLElement>

	return cloneElement(child, {
		onClick: e => {
			dismissToast(id)
			child.props.onClick?.(e)
		},
	})
}

function Toasts() {
	const toasts = useSelect(state => state.app.toasts)
	const { dismissToast, cancelDismissToast, restartDismissToast } = useAction().app
	const items = useMemo(() => {
		return Object.values(toasts).sort((a, b) => Number(a.id) - Number(b.id))
	}, [toasts])

	const refMap = useMemo(() => new WeakMap<InnerToasterToast, HTMLDivElement>(), [])
	const cancelMap = useMemo(() => new WeakMap(), [])
	const api = useSpringRef()
	const transitions = useTransition(items, {
		ref: api,
		keys: item => item.id,
		from: {
			opacity: 0.7,
			height: 0,
			transform: "translateX(0%)",
		},
		enter: item => async (next, cancel) => {
			cancelMap.set(item, cancel)
			await next({
				opacity: 1,
				transform: "translateX(0%)",
				height: refMap.get(item)?.offsetHeight,
			})
		},
		leave: [{ opacity: 0, transform: "translateX(100%)" }, { height: 0 }],
		config: { duration: 300, easing: easings.easeInOutCubic },
	})

	useEffect(() => {
		api.start()
	}, [api, items])

	return transitions((s, { variant, ...item }) => (
		<animated.div tw="relative" style={s}>
			<div
				tw="pb-2 first-of-type:(absolute inset-0 top-auto) sm:(pt-3 first-of-type:relative)"
				className={cx("group", variant)}
				ref={(ref: HTMLDivElement) => ref && refMap.set(item, ref)}
			>
				<div
					css={toastVariants({ variant })}
					onPointerEnter={() => {
						cancelDismissToast(item.id)
					}}
					onPointerLeave={() => {
						restartDismissToast(item.id)
					}}
				>
					<div tw="grid gap-1">
						{item.title && <ToastTitle>{item.title}</ToastTitle>}
						{item.description && (
							<ToastDescription>
								{item.description} {item.id}
							</ToastDescription>
						)}
					</div>
					{item.action && <ToastAction id={item.id}>{item.action}</ToastAction>}
					<CloseButton tw="absolute right-0.5 top-0.5" onClick={() => dismissToast(item.id)} />
				</div>
			</div>
		</animated.div>
	))
}
