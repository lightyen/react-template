import { forwardRef, type LabelHTMLAttributes } from "react"

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(({ ...props }, ref) => (
	<label ref={ref} tw="text-sm font-medium leading-none" {...props} />
))
Label.displayName = "Label"
