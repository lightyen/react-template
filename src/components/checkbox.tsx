import { css } from "@emotion/react"
import { CheckIcon, DividerHorizontalIcon } from "@radix-ui/react-icons"
import { InputHTMLAttributes, forwardRef, useEffect, useId, useRef } from "react"
import { tw } from "twobj"
import { useComposedRefs } from "./lib/compose"

const InputControl = tw.input`hidden`

const effects = css`
	${InputControl}:focus-visible + & {
		${tw`outline-none ring-1 ring-ring`}
	}
	${InputControl}:disabled + & {
		${tw`pointer-events-none opacity-50`}
	}
	${InputControl}:checked + &, ${InputControl}:indeterminate + & {
		${tw`bg-primary text-primary-foreground`}
	}
	${InputControl}:not(:checked) + & .checked_icon {
		${tw`hidden`}
	}
	${InputControl}:indeterminate + & .checked_icon {
		${tw`hidden`}
	}
	${InputControl}:not(:indeterminate) + & .indeterminated_icon {
		${tw`hidden`}
	}
	${InputControl}:indeterminate + & .indeterminated_icon {
		${tw`visible`}
	}
`

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
	intermediate?: boolean | undefined
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
	({ id, className, intermediate, onFocus, onBlur, onKeyDown, ...props }, forwardedRef) => {
		const innerId = useId()
		const inputRef = useRef<HTMLInputElement | null>(null)
		const ref = useComposedRefs(forwardedRef, inputRef)
		const isFocus = useRef(false)
		if (!id) id = innerId
		useEffect(() => {
			if (intermediate != undefined) {
				if (inputRef.current) {
					inputRef.current.indeterminate = intermediate
				}
			}
		}, [intermediate])
		return (
			<>
				<InputControl ref={ref} id={id} type="checkbox" {...props} />
				<label
					htmlFor={id}
					tabIndex={0}
					tw="h-[18px] w-[18px] shrink-0 rounded-full border-2 border-primary shadow select-none cursor-pointer
						focus-visible:(outline-none ring-1 ring-ring)
						flex items-center text-current
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
				>
					<CheckIcon className="checked_icon" />
					<DividerHorizontalIcon className="indeterminated_icon" />
				</label>
			</>
		)
	},
)
Checkbox.displayName = "Checkbox"
