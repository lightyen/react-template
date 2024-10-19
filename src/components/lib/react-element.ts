/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
	isValidElement,
	type ComponentProps,
	type JSXElementConstructor,
	type ReactElement,
	type ReactNode,
} from "react"

export function isElement<C extends JSXElementConstructor<any> = JSXElementConstructor<any>>(
	element: ReactNode,
	component: C,
): element is ReactElement<ComponentProps<C>, C> {
	if (!isValidElement(element)) {
		return false
	}
	if (assertElement(element.type, component)) {
		return true
	}
	return assertElement(element.props["__EMOTION_TYPE_PLEASE_DO_NOT_USE__"], component)
}

export function assertElement<C extends JSXElementConstructor<any> = JSXElementConstructor<any>>(
	type: string | JSXElementConstructor<any>,
	component: C,
): boolean {
	if (!type || !component) {
		return false
	}
	if (type === component) {
		return true
	}
	if (component["$id"]) {
		if (type["$id"] === component["$id"]) {
			return true
		}
	}
	return false
}
