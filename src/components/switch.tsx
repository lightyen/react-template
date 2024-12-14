import { type InputHTMLAttributes, type Ref } from "react"
import { tw } from "twobj"

interface SwitchProps extends InputHTMLAttributes<HTMLInputElement> {
	ref?: Ref<HTMLInputElement>
}

export function Switch({ type: _, disabled, className, children, ...props }: SwitchProps) {
	return (
		<label
			tw="flex items-center relative select-none cursor-pointer text-current focus-within:outline-none
				hover:[input:not(:disabled):not(:checked) ~ .lever]:bg-foreground/20
			"
			css={disabled && tw`cursor-not-allowed opacity-50`}
			className={className}
		>
			<input
				type="checkbox"
				tw="absolute w-0 h-0
					[&:disabled ~ .lever]:pointer-events-none
					[&:checked ~ .lever]:bg-primary
					[&:checked ~ .lever::after]:translate-x-5
					focus-visible:[& ~ .lever]:(ring-2 ring-ring ring-offset-2 ring-offset-background)
				"
				disabled={disabled}
				{...props}
			/>
			<span
				className="lever"
				tw="
					flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full bg-input
					border-2 border-transparent shadow-sm transition-colors
					focus-visible:(outline-none ring-2 ring-ring ring-offset-2 ring-offset-background)
					after:(pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 ring-offset-0 transition-transform duration-150)
				"
			/>
			{children && <span tw="px-[5px] font-medium">{children}</span>}
		</label>
	)
}
Switch.displayName = "Switch"
