import type { FormatXMLElementFn, Options, PrimitiveType } from "intl-messageformat"
import { Fragment } from "react"
import type { MessageDescriptor } from "react-intl"
import { useSelect } from "../hooks"

export interface FormattedMessageProps<
	V extends Record<string, unknown> = Record<
		string,
		React.ReactNode | PrimitiveType | FormatXMLElementFn<React.ReactNode>
	>,
> extends MessageDescriptor {
	values?: V
	tagName?: React.ElementType
	ignoreTag?: Options["ignoreTag"]
	children?(nodes: React.ReactNode[]): React.ReactNode | null
}

export function FormattedMessage({
	id,
	description,
	defaultMessage,
	values,
	ignoreTag,
	tagName: Component = Fragment,
	children,
}: FormattedMessageProps) {
	const intl = useSelect(state => state.intl.useIntl)
	const nodes = intl.formatMessage({ id, description, defaultMessage }, values, { ignoreTag })
	if (typeof children === "function") {
		return children(Array.isArray(nodes) ? nodes : [nodes])
	}
	if (Component) {
		return <Component>{nodes}</Component>
	}
	return nodes
}

export function useIntl() {
	return useSelect(state => state.intl.useIntl)
}
