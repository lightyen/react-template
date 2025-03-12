import { useIntl } from "./hook"

export interface FormattedDateTimeRangeProps {
	from: Parameters<Intl.DateTimeFormat["formatRange"]>[0]
	to: Parameters<Intl.DateTimeFormat["formatRange"]>[1]
	children?(value: React.ReactNode): React.ReactElement | null
}

export function FormattedDateTimeRange({ from, to, children, ...props }: FormattedDateTimeRangeProps) {
	const intl = useIntl(s => s.intl)
	const formattedValue = intl.formatDateTimeRange(from, to, props)
	if (typeof children === "function") {
		return children(formattedValue)
	}
	const Text = intl.textComponent
	if (Text) {
		return <Text>{formattedValue}</Text>
	}
	return formattedValue
}
