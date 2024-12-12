import { type LabelHTMLAttributes, type Ref } from "react"

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
	ref?: Ref<HTMLLabelElement>
}

export function Label(props) {
	return <label tw="text-sm font-medium leading-none" {...props} />
}
Label.displayName = "Label"
