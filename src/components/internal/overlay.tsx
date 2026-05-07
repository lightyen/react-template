import { animated, useSpringRef, useTransition } from "@react-spring/web"
import BezierEasing from "bezier-easing"
import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { tx } from "twobj"
import { addDialogCount, getDialogCount, getViewportElement, setScroll, subtractDialogCount } from "./scrollbar"

interface OverlayProps extends React.HTMLAttributes<HTMLDivElement> {
	visible: boolean
	blur?: boolean
	duration?: number
	onClickOverlay?(e: React.PointerEvent<HTMLDivElement>): void
}

export function Overlay({
	visible,
	blur = true,
	duration = 150,
	onClickOverlay = () => void 0,
	onPointerDown = () => void 0,
	onPointerUp = () => void 0,
	onClick,
	...props
}: React.PropsWithChildren<OverlayProps>) {
	const api = useSpringRef()

	const pointerId = useRef(0)

	const destroyedRef = useRef<null | boolean>(null)

	useEffect(() => {
		const destroyed = destroyedRef.current
		if (visible) {
			setScroll(true)
		}
		return () => {
			if (typeof destroyed === "boolean") {
				if (getDialogCount() === 0) {
					setScroll(false)
				}
			}
		}
	}, [visible])

	const [transitions] = useTransition(visible, () => ({
		ref: api,
		from: blur ? (tx`bg-foreground/0 [backdrop-filter: blur(0px)]` as {}) : tx`bg-foreground/0`,
		enter: blur ? tx`bg-foreground/15 [backdrop-filter: blur(2px)]` : tx`bg-foreground/15`,
		leave: blur ? tx`bg-foreground/0 [backdrop-filter: blur(0px)]` : tx`bg-foreground/0`,
		config: { duration, easing: BezierEasing(0.4, 0, 0.33, 1) },
		onDestroyed(end) {
			if (!end) {
				destroyedRef.current = false
				return
			}

			destroyedRef.current = true
			if (getDialogCount() === 0) {
				setScroll(false)
			}
		},
	}))

	useEffect(() => {
		if (visible) {
			addDialogCount()
			api.start()
		}
		return () => {
			if (visible) {
				subtractDialogCount()
				api.start()
			}
		}
	}, [visible, api])

	useEffect(() => {
		return () => {
			if (destroyedRef.current === false && getDialogCount() === 0) {
				setScroll(false)
			}
		}
	}, [])

	return createPortal(
		transitions((s, item) => {
			return (
				item && (
					<animated.div
						data-type="overlay"
						tw="pointer-events-auto [& > :nth-last-of-type(-n+2)]:pointer-events-auto select-none [> *]:select-text
							fixed inset-0 z-50 [&:has([role=dialog])]:(grid place-content-center place-items-center)
						"
						style={s}
						onPointerDown={event => {
							onPointerDown(event)
							if (event.pointerId >= 0) {
								pointerId.current = event.pointerId
							}
						}}
						onPointerUp={event => {
							onPointerUp(event)
							if (event.pointerId === pointerId.current) {
								pointerId.current = 0
								onClickOverlay(event)
							}
						}}
						onClick={() => void 0}
						{...props}
					/>
				)
			)
		}),
		getViewportElement(),
	)
}
