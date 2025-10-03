import type { FormatXMLElementFn, Options, PrimitiveType } from "intl-messageformat"
import React from "react"
import type * as Intl from "react-intl"
import { useIntl } from "./hook"

export interface FormattedMessageProps<
	V extends Record<string, unknown> = Record<
		string,
		React.ReactNode | PrimitiveType | FormatXMLElementFn<React.ReactNode>
	>,
> extends Intl.MessageDescriptor {
	values?: V
	tagName?: React.ElementType
	ignoreTag?: Options["ignoreTag"]
	children?(nodes: React.ReactNode): React.ReactNode | null
}

export function FormattedMessage({
	id,
	description,
	defaultMessage,
	values,
	ignoreTag,
	tagName: Component,
	children,
}: FormattedMessageProps) {
	const intl = useIntl(s => s.intl)
	const nodes = intl.formatMessage({ id, description, defaultMessage }, values, { ignoreTag })
	if (typeof children === "function") {
		return children(Array.isArray(nodes) ? nodes : [nodes])
	}
	if (Component) {
		return <Component>{nodes}</Component>
	}
	return nodes
}

// interface Formatter {
// 	formatDate: Intl.FormatDateOptions
// 	formatTime: Intl.FormatDateOptions
// 	formatNumber: Intl.FormatNumberOptions
// 	formatList: Intl.FormatListOptions
// 	formatDisplayName: Intl.FormatDisplayNameOptions
// }

export interface FormattedListProps extends Intl.FormatListOptions {
	value: readonly React.ReactNode[]
	children?(nodes: React.ReactNode): React.ReactNode | null
}

export function FormattedList({ value, children, ...formatProps }: FormattedListProps) {
	const intl = useIntl(s => s.intl)
	const formattedValue = intl.formatList(value, formatProps)

	console.log(formattedValue)

	if (typeof children === "function") {
		return children(formattedValue)
	}

	const Text = intl.textComponent || React.Fragment
	return <Text>{formattedValue}</Text>
}
