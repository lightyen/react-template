export function Label(props: React.LabelHTMLAttributes<HTMLLabelElement> & { ref?: React.Ref<HTMLLabelElement> }) {
	return <label tw="text-sm font-medium leading-none" {...props} />
}
Label.displayName = "Label"
