import { tw } from "twobj"

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
	ref?: React.Ref<HTMLInputElement>
}

export function Switch({ type: _, disabled, className, style, children, ...props }: SwitchProps) {
	return (
		<label
			role="switch"
			tw="inline-flex items-center relative select-none cursor-pointer text-current focus-within:outline-none
				hover:[input:not(:disabled):not(:checked) ~ .lever]:bg-foreground/20
			"
			css={disabled && tw`pointer-events-none opacity-50`}
			className={className}
			style={style}
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
				tw="flex shrink-0 cursor-pointer items-center rounded-full bg-input
					shadow-sm transition-colors
					after:(h-full aspect-square pointer-events-none block rounded-full bg-background shadow-lg ring-0 ring-offset-0 transition-transform duration-150)
				"
				css={tw`h-6 w-11 p-[3px]`}
			/>
			{children && <span tw="px-[5px] font-medium">{children}</span>}
		</label>
	)
}
Switch.displayName = "Switch"
