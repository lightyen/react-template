import { forwardRef, type ButtonHTMLAttributes } from "react"
import { tw } from "twobj"
import { zs, type VariantProps } from "./lib"

export const buttonVariants = zs(
	tw`line-height-3 inline-flex gap-2 items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors
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
