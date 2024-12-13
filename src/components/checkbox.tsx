import { CheckIcon, DividerHorizontalIcon } from "@radix-ui/react-icons"
import { InputHTMLAttributes, type Ref, useEffect, useRef } from "react"
import { tw } from "twobj"
import { composeRefs } from "./lib/compose"

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
	intermediate?: boolean | undefined
	ref?: Ref<HTMLInputElement>
	squared?: boolean
}

export function Checkbox({ type: _, intermediate, squared, className, ref, children, ...props }: CheckboxProps) {
	const inputRef = useRef<HTMLInputElement | null>(null)
	useEffect(() => {
		if (intermediate != undefined) {
			if (inputRef.current) {
				inputRef.current.indeterminate = intermediate
			}
		}
	}, [intermediate])

	return (
		<label
			tw="flex items-center relative select-none cursor-pointer text-current
			(hover:):[input:not(:checked):not(:indeterminate) ~ .checkmark]:bg-primary/20
			focus-within:outline-none
			"
			className={className}
		>
			<input
				type="checkbox"
				ref={composeRefs(ref, inputRef)}
				tw="absolute w-0 h-0
				[&:checked ~ .checkmark]:(bg-primary text-primary-foreground)
				[&:not(:checked) ~ .checkmark .checked_icon]:hidden
				[&:indeterminate ~ .checkmark]:(bg-primary text-primary-foreground)
				[&:indeterminate ~ .checkmark .checked_icon]:hidden
				[&:not(:indeterminate) ~ .checkmark .indeterminated_icon]:hidden
				[&:indeterminate ~ .checkmark .indeterminated_icon]:visible
				focus-visible:[& ~ .checkmark]:(shadow-primary/30 shadow-[0 0 0 3px var(--tw-shadow-color)])
				"
				{...props}
			/>
			<span
				className="checkmark"
				tw="flex items-center justify-center w-[18px] h-[18px] border-2 border-primary transition-[ box-shadow] duration-150"
				css={!squared && tw`rounded-full`}
			>
				<CheckIcon className="checked_icon" />
				<DividerHorizontalIcon className="indeterminated_icon" />
			</span>
			{children && <span tw="ml-2 text-sm font-medium leading-none">{children}</span>}
		</label>
	)
}
Checkbox.displayName = "Checkbox"
