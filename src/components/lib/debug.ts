/* eslint-disable @typescript-eslint/no-explicit-any */
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
	if (assertElement(component, element.type)) {
		return true
	}
	return assertElement(component, element.props["__EMOTION_TYPE_PLEASE_DO_NOT_USE__"])
}

export function assertElement<C extends JSXElementConstructor<any> = JSXElementConstructor<any>>(
	component: C,
	type?: string | JSXElementConstructor<any>,
): boolean {
	if (!type) {
		return false
	}
	if (!component) {
		return false
	}
	if (component["$id"]) {
		if (type["$id"] === component["$id"]) {
			return true
		}
	}
	return false
}
