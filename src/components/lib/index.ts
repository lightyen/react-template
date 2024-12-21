export * from "./color"
export * from "./compose"
export * from "./react-element"
export * from "./style"

export function getElementHeight(el: HTMLElement): number {
	el.style.height = "auto"
	const h = el.offsetHeight
	el.style.height = ""
	return h
}

export function getElementWidth(el: HTMLElement): number {
	const h = el.offsetWidth
	return h
}
