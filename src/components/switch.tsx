import { css } from "@emotion/react"
import { useId, useRef, type InputHTMLAttributes, type Ref } from "react"
import { tw } from "twobj"
import { composeRefs } from "./lib/compose"

const InputControl = tw.input`hidden`

const effects = css`
	${InputControl}:disabled + & {
		${tw`pointer-events-none opacity-50`}
	}
	${InputControl}:checked + & {
		${tw`bg-primary`}
	}
	${InputControl}:checked + &::after {
		${tw`translate-x-5`}
	}
`

export function Switch({
	id,
	className,
	onFocus,
	onBlur,
	onKeyDown,
	ref,
	...props
}: InputHTMLAttributes<HTMLInputElement> & { ref?: Ref<HTMLInputElement> }) {
	const defaultId = useId()
	if (!id) {
		id = defaultId
	}
	const inputRef = useRef<HTMLInputElement | null>(null)
	const isFocus = useRef(false)
	return (
		<>
			<InputControl ref={composeRefs(ref, inputRef)} id={id} type="checkbox" {...props} />
			<label
				htmlFor={id}
				tabIndex={0}
				tw="inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full
					border-2 border-transparent shadow-sm transition-colors
					bg-input
					focus-visible:(outline-none ring-2 ring-ring ring-offset-2 ring-offset-background)
					after:(pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 ring-offset-0 transition-transform duration-150)
				"
				css={effects}
				className={className}
				onFocus={_ => {
					isFocus.current = true
				}}
				onBlur={_ => {
					isFocus.current = false
				}}
				onKeyDown={e => {
					if (!isFocus.current || !inputRef.current) {
						return
					}
					const isSpace = e.key == " " || e.code == "Space"
					if (isSpace || e.key == "Enter") {
						e.preventDefault()
						inputRef.current.checked = !inputRef.current.checked
					}
				}}
			></label>
		</>
	)
}
Switch.displayName = "Switch"
