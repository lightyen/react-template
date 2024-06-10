export interface RgbColor {
	r: number // [0, 255]
	g: number // [0, 255]
	b: number // [0, 255]
}

export interface HslColor {
	h: number // [0 - 360]
	s: number // [0 - 100]
	l: number // [0 - 100]
}

export function parseHslColor(value: string): HslColor | undefined {
	if (value) {
		const re = /^([+-]?(?:\d*[.])?\d+)\s* \s*([+-]?(?:\d*[.])?\d+)%?\s* \s*([+-]?(?:\d*[.])?\d+)%?$/
		const m = re.exec(value)
		if (m) {
			const [, h, s, l] = m
			return { h: Number(h), s: Number(s), l: Number(l) }
		}
	}
}

function _relativeLuminance(p: number) {
	if (p <= 0.03928) {
		return p / 12.92
	} else {
		return Math.pow((p + 0.055) / 1.055, 2.4)
	}
}

// https://www.w3.org/TR/WCAG20/#relativeluminancedef
export function relativeLuminance(color: RgbColor) {
	const r = _relativeLuminance(color.r / 255.0)
	const g = _relativeLuminance(color.g / 255.0)
	const b = _relativeLuminance(color.b / 255.0)
	return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contrastRatio(l1: number, l2: number) {
	if (l1 < l2) {
		return (l2 + 0.05) / (l1 + 0.05)
	}
	return (l1 + 0.05) / (l2 + 0.05)
}

/** @return new foreground rgb color */
export function ensureContrastRatio(fg: RgbColor, bg: RgbColor, ratio: number): RgbColor | undefined {
	const fgL = relativeLuminance(fg)
	const bgL = relativeLuminance(bg)
	const r = contrastRatio(fgL, bgL)
	if (r >= ratio) {
		return undefined
	}
	const increased = increaseLuminance(fg, bg, ratio)
	if (contrastRatio(relativeLuminance(increased), bgL) >= ratio) {
		return increased
	}
	return reduceLuminance(fg, bg, ratio)
}

function increaseLuminance(foreground: RgbColor, background: RgbColor, ratio: number): RgbColor {
	const bgL = relativeLuminance(background)
	const p = 0.1
	const fg: RgbColor = { r: foreground.r, g: foreground.g, b: foreground.b }
	let r = contrastRatio(relativeLuminance(fg), bgL)
	while (r < ratio && (fg.r < 0xff || fg.g < 0xff || fg.b < 0xff)) {
		fg.r = Math.min(0xff, fg.r + Math.ceil((255 - fg.r) * p))
		fg.g = Math.min(0xff, fg.g + Math.ceil((255 - fg.g) * p))
		fg.b = Math.min(0xff, fg.b + Math.ceil((255 - fg.b) * p))
		r = contrastRatio(relativeLuminance(fg), bgL)
	}
	return fg
}

function reduceLuminance(foreground: RgbColor, background: RgbColor, ratio: number): RgbColor {
	const step = 0.1
	const bgL = relativeLuminance(background)
	const fg: RgbColor = { r: foreground.r, g: foreground.g, b: foreground.b }
	let r = contrastRatio(relativeLuminance(fg), bgL)
	while (r < ratio && (fg.r > 0 || fg.g > 0 || fg.b > 0)) {
		fg.r = fg.r - Math.max(0, Math.ceil(fg.r * step))
		fg.g = fg.g - Math.max(0, Math.ceil(fg.g * step))
		fg.b = fg.b - Math.max(0, Math.ceil(fg.b * step))
		r = contrastRatio(relativeLuminance(fg), bgL)
	}
	return fg
}

function round(num: number, p = 0): number {
	const b = 10 ** p
	return Math.round((num + Number.EPSILON) * b) / b
}

export function hsl2rgb(hsl: HslColor): RgbColor {
	const h = (hsl.h + 360) % 360
	const s = hsl.s / 100.0
	const l = hsl.l / 100.0

	const c = (1 - Math.abs(2 * l - 1)) * s
	const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
	const m = l - c / 2
	let ret: RgbColor
	if (h < 60) {
		// {r: , g: , b: }
		ret = { r: (c + m) * 255, g: (x + m) * 255, b: m * 255 }
	} else if (h < 120) {
		ret = { r: (x + m) * 255, g: (c + m) * 255, b: m * 255 }
	} else if (h < 180) {
		ret = { r: m * 255, g: (c + m) * 255, b: (x + m) * 255 }
	} else if (h < 240) {
		ret = { r: m * 255, g: (x + m) * 255, b: (c + m) * 255 }
	} else if (h < 300) {
		ret = { r: (x + m) * 255, g: m * 255, b: (c + m) * 255 }
	} else {
		ret = { r: (c + m) * 255, g: m * 255, b: (x + m) * 255 }
	}

	ret.r = round(ret.r)
	ret.g = round(ret.g)
	ret.b = round(ret.b)

	return ret
}

export function rgb2hsl(v: RgbColor): HslColor {
	const max = Math.max(v.r, v.g, v.b)
	const min = Math.min(v.r, v.g, v.b)
	const delta = max - min
	const l = (max + min) / 510.0
	let h = 0
	let s = 0
	if (delta > 0) {
		switch (max) {
			case v.g:
				h = 60 * (2 + (v.b - v.r) / delta)
				break
			case v.b:
				h = 60 * (4 + (v.r - v.g) / delta)
				break
			default:
				h = 60 * ((6 + (v.g - v.b) / delta) % 6)
		}
		if (l > 0.5) {
			s = delta / (510 * (1 - l))
		} else {
			s = delta / (510 * l)
		}
	}
	return { h: round(h), s: round(s * 100.0), l: round(l * 100.0) }
}

export function rgb2Css(v: RgbColor): string {
	return `${v.r} ${v.g} ${v.b}`
}

export function hsl2Css(v: HslColor): string {
	v.s = Math.min(v.s, 100)
	v.l = Math.min(v.l, 100)
	return `${v.h} ${v.s}% ${v.l}%`
}
