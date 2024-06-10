import { useEffect, useState } from "react"
import { HslColorPicker } from "react-colorful"
import { Button } from "~/components/button"
import { HslColor, ensureContrastRatio, hsl2Css, hsl2rgb, parseHslColor, rgb2hsl } from "~/components/lib/color"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/popover"
import { isDark } from "./theme"

function getThemeColors(style: CSSStyleDeclaration) {
	return {
		"--background": style.getPropertyValue("--background"),
		"--foreground": style.getPropertyValue("--foreground"),
		"--card": style.getPropertyValue("--card"),
		"--card-foreground": style.getPropertyValue("--card-foreground"),
		"--popover": style.getPropertyValue("--popover"),
		"--popover-foreground": style.getPropertyValue("--popover-foreground"),
		"--primary": style.getPropertyValue("--primary"),
		"--primary-foreground": style.getPropertyValue("--primary-foreground"),
		"--secondary": style.getPropertyValue("--secondary"),
		"--secondary-foreground": style.getPropertyValue("--secondary-foreground"),
		"--muted": style.getPropertyValue("--muted"),
		"--muted-foreground": style.getPropertyValue("--muted-foreground"),
		"--accent": style.getPropertyValue("--accent"),
		"--accent-foreground": style.getPropertyValue("--accent-foreground"),
		"--destructive": style.getPropertyValue("--destructive"),
		"--destructive-foreground": style.getPropertyValue("--destructive-foreground"),
		"--border": style.getPropertyValue("--border"),
		"--input": style.getPropertyValue("--input"),
		"--ring": style.getPropertyValue("--ring"),
	}
}

function ensureContrast(bg: HslColor): string {
	const fg: HslColor = { h: bg.h, s: 5, l: isDark() ? 100 : 0 }
	const ans = ensureContrastRatio(hsl2rgb(fg), hsl2rgb(bg), 6)
	if (ans) {
		return hsl2Css(rgb2hsl(ans))
	}
	return hsl2Css(fg)
}

export function CustomColorPicker() {
	function handle(primary: HslColor) {
		const background: HslColor = { h: primary.h, s: 50, l: isDark() ? 5 : 95 }
		const secondary: HslColor = { h: primary.h, s: 30, l: isDark() ? 20 : 90 }

		const style = document.documentElement.style

		style.setProperty("--background", hsl2Css(background))
		style.setProperty("--foreground", ensureContrast(background))
		style.setProperty("--primary", hsl2Css(primary))
		style.setProperty("--primary-foreground", ensureContrast(primary))
		style.setProperty("--secondary", hsl2Css(secondary))
		style.setProperty("--secondary-foreground", ensureContrast(secondary))
	}

	const [selectedColor, setSelectedColor] = useState<HslColor | undefined>(() => {
		const style = getComputedStyle(document.documentElement)
		const background = style.getPropertyValue("--primary")
		return parseHslColor(background)
	})

	console.log(selectedColor)

	useEffect(() => {
		const ob = new MutationObserver(mutations => {
			const el = mutations[0]?.target as HTMLElement
			if (el) {
				const theme = getThemeColors(getComputedStyle(el))
				const color = parseHslColor(theme["--primary"])
				setSelectedColor(v => {
					if (!color) {
						return undefined
					}
					if (!v) {
						return color
					}
					if (v.h === color.h && v.s === color.s && v.l === color.l) {
						return v
					}
					return
				})
			}
		})
		ob.observe(document.documentElement, { attributeFilter: ["class"] })
		return () => {
			ob.disconnect()
		}
	}, [])

	return (
		<div>
			<Popover placement="bottom-end">
				<PopoverTrigger>
					<Button type="button" aria-label="Switch Language" variant="ghost" size="icon" tw="rounded-none">
						<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
							<path
								fill="currentColor"
								d="M12 22A10 10 0 0 1 2 12A10 10 0 0 1 12 2c5.5 0 10 4 10 9a6 6 0 0 1-6 6h-1.8c-.3 0-.5.2-.5.5c0 .1.1.2.1.3c.4.5.6 1.1.6 1.7c.1 1.4-1 2.5-2.4 2.5m0-18a8 8 0 0 0-8 8a8 8 0 0 0 8 8c.3 0 .5-.2.5-.5c0-.2-.1-.3-.1-.4c-.4-.5-.6-1-.6-1.6c0-1.4 1.1-2.5 2.5-2.5H16a4 4 0 0 0 4-4c0-3.9-3.6-7-8-7m-5.5 6c.8 0 1.5.7 1.5 1.5S7.3 13 6.5 13S5 12.3 5 11.5S5.7 10 6.5 10m3-4c.8 0 1.5.7 1.5 1.5S10.3 9 9.5 9S8 8.3 8 7.5S8.7 6 9.5 6m5 0c.8 0 1.5.7 1.5 1.5S15.3 9 14.5 9S13 8.3 13 7.5S13.7 6 14.5 6m3 4c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5s-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5"
							/>
						</svg>
					</Button>
				</PopoverTrigger>
				<PopoverContent>
					<HslColorPicker
						color={selectedColor}
						onChange={color => {
							handle(color)
						}}
					/>
				</PopoverContent>
			</Popover>
		</div>
	)
}
