import { type InputHTMLAttributes, type Ref } from "react"

interface SwitchProps extends InputHTMLAttributes<HTMLInputElement> {
	ref?: Ref<HTMLInputElement>
}

export function Switch({ type: _, className, children, ...props }: SwitchProps) {
	return (
		<label
			tw="flex items-center relative select-none cursor-pointer text-current
			(hover:):[input:not(:checked) ~ .lever]:bg-primary/33
			focus-within:outline-none
			"
			className={className}
		>
			<input
				type="checkbox"
				tw="absolute w-0 h-0
					[&:disabled ~ .lever]:(pointer-events-none opacity-50)
					[&:checked ~ .lever]:bg-primary
					[&:checked ~ .lever::after]:translate-x-5
					focus-visible:[& ~ .lever]:(ring-2 ring-ring ring-offset-2 ring-offset-background)
					"
				{...props}
			/>
			<span
				className="lever"
				tw="
					flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full
					border-2 border-transparent shadow-sm transition-colors
					bg-input
					focus-visible:(outline-none ring-2 ring-ring ring-offset-2 ring-offset-background)
					after:(pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 ring-offset-0 transition-transform duration-150)
				"
			></span>
			{children && <span tw="ml-2 text-sm font-medium leading-none">{children}</span>}
		</label>
	)
}
Switch.displayName = "Switch"
