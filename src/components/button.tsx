import { Cross2Icon } from "@radix-ui/react-icons"
import { forwardRef, type ButtonHTMLAttributes } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import { tw } from "twobj"
import { zs, type VariantProps } from "./lib"

export const buttonVariants = zs(
	tw`line-height-3 inline-flex gap-2 items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors select-none
	focus-visible:(outline-none ring-1 ring-ring) disabled:(pointer-events-none opacity-50)`,
	{
		variants: {
			variant: {
				default: tw`bg-primary text-primary-foreground hover:bg-primary/90`,
				destructive: tw`bg-destructive text-destructive-foreground hover:bg-destructive/90`,
				outline: tw`border border-input bg-background hover:(bg-accent text-accent-foreground)`,
				secondary: tw`bg-secondary text-secondary-foreground hover:bg-secondary/80`,
				ghost: tw`hover:(bg-accent text-accent-foreground)`,
				link: tw`text-primary underline-offset-4 hover:underline`,
			},
			size: {
				default: tw`h-9 px-4 [font-size: 15px] [svg]:(w-4 h-4)`,
				sm: tw`h-8 rounded-md px-3 [font-size: 13px] [svg]:(w-4 h-4)`,
				lg: tw`h-10 rounded-md px-8 [font-size: 17px]`,
				icon: tw`h-[34px] w-[34px]`,
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
)

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ type = "button", ...props }, ref) => {
	return <button type={type} role="button" css={buttonVariants(props)} ref={ref} {...props} />
})
Button.displayName = "Button"

export const CloseButton = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
	const intl = useIntl()
	return (
		<button
			type="button"
			role="button"
			tw="p-0.5 rounded-sm opacity-70 ring-offset-background transition duration-150
			hover:(opacity-100 bg-accent text-accent-foreground)
			focus:outline-none
			disabled:pointer-events-none"
			title={intl.formatMessage({ id: "close" })}
			ref={ref}
			{...props}
		>
			<Cross2Icon tw="h-5 w-5" />
			<span tw="sr-only">
				<FormattedMessage id="close" />
			</span>
		</button>
	)
})
CloseButton.displayName = "CloseButton"
