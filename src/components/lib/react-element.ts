/* eslint-disable @typescript-eslint/no-explicit-any */
import { isValidElement, ReactNode } from "react"

export function isElement<C extends React.JSXElementConstructor<any> = React.JSXElementConstructor<any>>(
	element: React.ReactNode,
	component: C,
): element is React.ReactElement<React.ComponentProps<C>, C> {
	if (!isValidElement(element)) {
		return false
	}
	if (assertElement(element.type, component)) {
		return true
	}

	return assertElement((element.props as any)["__EMOTION_TYPE_PLEASE_DO_NOT_USE__"], component)
}

export function isReactNode<P>(e: React.ReactNode | React.ComponentType<P>): e is ReactNode {
	if (typeof e === "function") {
		return false
	}
	return true
}

export function assertElement<C extends React.JSXElementConstructor<any> = React.JSXElementConstructor<any>>(
	type: string | React.JSXElementConstructor<any>,
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
