import type { MutableRefObject, Ref, SyntheticEvent } from "react"

export type NullableRef<T> = Ref<T> | null | undefined

export function setRef<T extends Element>(ref: NullableRef<T>, node: T) {
	if (typeof ref === "function") {
		ref(node)
	} else if (ref != null) {
		const o = ref as MutableRefObject<T>
		o.current = node
	}
}

export function composeRefs<T extends Element>(...refs: NullableRef<T>[]) {
	return (node: T) => {
		for (const ref of refs) {
			setRef(ref, node)
		}
	}
}

export function composeEventHandlers<E extends SyntheticEvent>(
	originalEventHandler?: (event: E) => void,
	innerEventHandler?: (event: E) => void,
	{ checkForDefaultPrevented = true } = {},
) {
	return (event: E) => {
		originalEventHandler?.(event)
		if (checkForDefaultPrevented === false || !event.defaultPrevented) {
			return innerEventHandler?.(event)
		}
	}
}
