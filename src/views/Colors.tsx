import { useEffect, useState } from "react"
import { HslColorPicker } from "react-colorful"
import { Route } from "react-router"
import { Button } from "~/components/button"
import { Card, CardContent, CardTitle } from "~/components/card"
import { Input } from "~/components/input"
import { hsl2Css, parseHslColor } from "~/components/lib"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/popover"

export const ColorsRoutes = <Route path="colors" Component={Component} />

export function Component() {
	return (
		<div tw="max-w-2xl grid gap-10">
			<div tw="grid gap-2 rounded-lg">
				<div tw="p-1 rounded-lg bg-background text-foreground">foreground</div>
				<Card tw="p-3">
					<div tw="opacity-20">card</div>
					<div tw="text-lg font-bold">card</div>
				</Card>
				<div tw="p-3 rounded-lg bg-popover">
					<div tw="opacity-20">popover</div>
					<div tw="text-lg font-bold text-popover-foreground">popover</div>
				</div>
				<Button>Primary</Button>
				<Button variant="secondary">Secondary</Button>
				<div tw="p-1 text-muted-foreground bg-muted">muted</div>
				<Input disabled placeholder="muted" />
				<div tw="p-1 text-accent-foreground bg-accent">accent</div>
				<Button variant="outline">outline</Button>
				<div tw="p-1 text-destructive-foreground bg-destructive">destructive</div>
				<Button variant="destructive">destructive</Button>
				<div tw="p-1 rounded-lg bg-background border">border</div>
				<div tw="p-1 text-ring bg-background border border-ring">ring</div>
				<Input placeholder="ring" />
			</div>
			<DataSheet />
		</div>
	)
}

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

function DataSheet() {
	const [colors, setColors] = useState(() => getThemeColors(getComputedStyle(document.documentElement)))
	useEffect(() => {
		const ob = new MutationObserver(mutations => {
			const el = mutations[0]?.target as HTMLElement
			if (el) {
				setColors(getThemeColors(getComputedStyle(el)))
			}
		})
		ob.observe(document.documentElement, { attributeFilter: ["class", "style"] })
		return () => {
			ob.disconnect()
		}
	}, [])
	return (
		<Card tw="p-2">
			<CardTitle>HSL</CardTitle>
			<CardContent>
				<div tw="grid gap-2 whitespace-nowrap">
					{Object.entries(colors).map(([k, value]) => {
						return (
							<ColorPicker key={k} cssVariable={k}>
								<div tw="p-0.5 grid gap-2 items-center [grid-template-columns: 1fr 150px 200px] hover:(ring-1 ring-accent)">
									<div tw="text-right">{k}</div>
									<div tw="">{value}</div>
									<div tw="h-full" style={{ backgroundColor: `hsl(${value})` }} />
								</div>
							</ColorPicker>
						)
					})}
				</div>
			</CardContent>
		</Card>
	)
}

function ColorPicker({ cssVariable, children }: React.PropsWithChildren<{ cssVariable: string }>) {
	const color = parseHslColor(getComputedStyle(document.documentElement).getPropertyValue(cssVariable))
	return (
		<Popover placement="bottom">
			<PopoverTrigger>{children}</PopoverTrigger>
			<PopoverContent>
				<HslColorPicker
					color={color}
					onChange={color => {
						document.documentElement.style.setProperty(cssVariable, hsl2Css(color))
					}}
				/>
			</PopoverContent>
		</Popover>
	)
}
