import { EyeNoneIcon, EyeOpenIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons"
import { useState } from "react"
import { tw } from "twobj"
import { zs, type VariantProps } from "./lib"

const input = tw`
w-full flex-1 flex h-9 text-sm rounded-md border border-input bg-background px-3 shadow-sm transition-colors
file:(border-0 bg-background text-sm font-medium)
placeholder:text-muted-foreground
focus-within:(outline-none ring-1 ring-ring)
disabled:(pointer-events-none opacity-50)
box-border
[&[aria-invalid=true]]:(ring-1 ring-destructive bg-destructive/10)
`

export const inputVariants = zs(
	tw`w-full flex-1 flex [font-size: 14px] line-height-3 rounded-md border border-input bg-background px-3 shadow-sm transition-colors
	file:(border-0 bg-background text-sm font-medium)
	placeholder:text-muted-foreground
	focus-within:(outline-none ring-1 ring-ring)
	disabled:(pointer-events-none opacity-50)
	[&[aria-invalid=true]]:(ring-1 ring-destructive bg-destructive/10)`,
	{
		variants: {
			variant: {
				default: tw`h-9`,
				sm: tw`h-8`,
				lg: tw`h-10`,
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
)

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> &
	VariantProps<typeof inputVariants> & { ref?: React.Ref<HTMLInputElement> }

export function Input({ type = "text", variant, ...props }: InputProps) {
	return <input type={type} css={inputVariants({ variant })} {...props} />
}
Input.displayName = "Input"

export function SearchInput({ type: _, className, style, ...props }: InputProps) {
	return (
		<div css={input} tw="items-center" className={className} style={style}>
			<MagnifyingGlassIcon tw="mr-2 h-4 w-4 shrink-0 opacity-50" />
			<input type="text" tw="grow h-full bg-background outline-none" {...props} />
		</div>
	)
}
SearchInput.displayName = "SearchInput"

export function Password({ type: _, "aria-invalid": invalid, disabled, className, style, ...props }: InputProps) {
	const [reveal, setReveal] = useState(false)
	return (
		<div css={input} aria-invalid={invalid} className={className} style={style}>
			<input
				autoComplete="off"
				autoCorrect="off"
				spellCheck="false"
				tabIndex={0}
				tw="w-0 flex-1 focus-visible:outline-none bg-background [::-ms-reveal]:hidden disabled:(pointer-events-none opacity-50)"
				type={reveal ? "text" : "password"}
				disabled={disabled}
				aria-invalid={invalid}
				{...props}
			/>
			<button
				type="button"
				tabIndex={-1}
				disabled={disabled}
				tw="text-muted-foreground p-1 focus:outline-none transition rounded-lg disabled:(pointer-events-none text-muted)"
				onClick={() => setReveal(t => !t)}
			>
				{reveal ? <EyeOpenIcon /> : <EyeNoneIcon />}
			</button>
		</div>
	)
}
Password.displayName = "Password"

export function ErrorFeedBack(
	props: React.HTMLAttributes<HTMLParagraphElement> & { ref?: React.Ref<HTMLParagraphElement> },
) {
	return <p tw="text-[0.8rem] font-medium text-destructive" {...props} />
}
ErrorFeedBack.displayName = "ErrorFeedBack"
