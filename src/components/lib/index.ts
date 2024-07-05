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

export function isMobile() {
	return matchMedia("(pointer: coarse)").matches
}

export function isDesktop() {
	return matchMedia("(pointer: fine), (pointer: none)").matches
}

export function isTouchDesktop() {
	return matchMedia("(pointer: fine) and (any-pointer: coarse)").matches
}

export function isFirefox() {
	return /Firefox\//i.test(window.navigator.userAgent)
}
