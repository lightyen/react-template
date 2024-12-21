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
