import { useMemo } from "react"
import { HexColorPicker } from "react-colorful"
import { create } from "zustand"
import { Dialog, DialogContent, DialogTrigger } from "~/components/dialog"
import { isDark } from "~/concepts/theme"
import { generateRadixColors } from "../generate-radix-colors"

interface Theme {
	accentColor: string
	grayColor: string
	backgroundColor: string
}

interface State {
	dark: Theme
	light: Theme
	isDark: boolean
	darkPalette: ReturnType<typeof generateRadixColors>
	lightPalette: ReturnType<typeof generateRadixColors>
}

interface Action {
	setAccentColor(s: string): void
	setGrayColor(s: string): void
	setBackgroundColor(s: string): void
}

type PaletteResult = ReturnType<typeof generateRadixColors>

function createStore() {
	const dark = {
		accentColor: "#3D63DD",
		grayColor: "#8B8D98",
		backgroundColor: "#111111",
	}
	const light = {
		accentColor: "#3D63DD",
		grayColor: "#8B8D98",
		backgroundColor: "#FFFFFF",
	}
	return create<State & Action>()(set => ({
		dark,
		light,
		isDark: isDark(),
		darkPalette: generateRadixColors({
			appearance: "dark",
			accent: dark.accentColor,
			gray: dark.grayColor,
			background: dark.backgroundColor,
		}),
		lightPalette: generateRadixColors({
			appearance: "light",
			accent: light.accentColor,
			gray: light.grayColor,
			background: light.backgroundColor,
		}),
		setAccentColor(accentColor) {
			set(state => {
				if (state.isDark) {
					const palette = generateRadixColors({
						appearance: "dark",
						accent: accentColor,
						gray: state.dark.grayColor,
						background: state.dark.backgroundColor,
					})
					return { ...state, darkPalette: palette, dark: { ...state.dark, accentColor } }
				}
				const palette = generateRadixColors({
					appearance: "light",
					accent: accentColor,
					gray: state.light.grayColor,
					background: state.light.backgroundColor,
				})
				return { ...state, lightPalette: palette, light: { ...state.light, accentColor } }
			})
		},
		setGrayColor(grayColor) {
			set(state => {
				if (state.isDark) {
					const palette = generateRadixColors({
						appearance: "dark",
						accent: state.dark.accentColor,
						gray: grayColor,
						background: state.dark.backgroundColor,
					})
					return { ...state, darkPalette: palette, dark: { ...state.dark, grayColor } }
				}
				const palette = generateRadixColors({
					appearance: "light",
					accent: state.light.accentColor,
					gray: grayColor,
					background: state.light.backgroundColor,
				})
				return { ...state, lightPalette: palette, light: { ...state.light, grayColor } }
			})
		},
		setBackgroundColor(backgroundColor) {
			set(state => {
				if (state.isDark) {
					const palette = generateRadixColors({
						appearance: "dark",
						accent: state.dark.accentColor,
						gray: state.dark.grayColor,
						background: backgroundColor,
					})
					return { ...state, darkPalette: palette, dark: { ...state.dark, backgroundColor } }
				}
				const palette = generateRadixColors({
					appearance: "light",
					accent: state.light.accentColor,
					gray: state.light.grayColor,
					background: backgroundColor,
				})
				return { ...state, lightPalette: palette, light: { ...state.light, backgroundColor } }
			})
		},
	}))
}

const store = createStore()

function DarkPalette() {
	const palette = store(state => state.darkPalette)
	return (
		<section tw="my-10">
			<h3 tw="text-xl font-bold">Dark Mode</h3>
			<hr tw="my-2" />
			<div tw="mb-4">
				<h4 tw="my-2">Accent Scale</h4>
				<ColorRow t="accent" palette={palette} isDark />
			</div>
			<div>
				<h4 tw="my-2">Gray Scale</h4>
				<ColorRow t="gray" palette={palette} isDark />
			</div>
		</section>
	)
}

function LightPalette() {
	const palette = store(state => state.lightPalette)
	return (
		<section tw="my-10">
			<h3 tw="text-xl font-bold">Light Mode</h3>
			<hr tw="my-2" />
			<div tw="mb-4">
				<h4 tw="my-2">Accent Scale</h4>
				<ColorRow t="accent" palette={palette} />
			</div>
			<div>
				<h4 tw="my-2">Gray Scale</h4>
				<ColorRow t="gray" palette={palette} />
			</div>
		</section>
	)
}

function ColorPicker() {
	const setAccentColor = store(state => state.setAccentColor)
	const setGrayColor = store(state => state.setGrayColor)
	const setBackgroundColor = store(state => state.setBackgroundColor)

	const accentColor = store(state => (state.isDark ? state.dark.accentColor : state.light.accentColor))
	const grayColor = store(state => (state.isDark ? state.dark.grayColor : state.light.grayColor))
	const backgroundColor = store(state => (state.isDark ? state.dark.backgroundColor : state.light.backgroundColor))

	return (
		<div tw="flex gap-6 p-4 mb-8 rounded-lg">
			<label tw="flex flex-col gap-2 font-bold">
				自定義主色 (Accent):
				<div>
					<HexColorPicker color={accentColor} onChange={setAccentColor} />
					<div tw="mt-2 py-1 flex justify-center" style={{ backgroundColor: accentColor }}>
						{accentColor}
					</div>
				</div>
			</label>
			<div tw="flex flex-col gap-2 font-bold">
				自定義灰色 (Gray):
				<div>
					<HexColorPicker color={grayColor} onChange={setGrayColor} />
					<div tw="mt-2 py-1 flex justify-center" style={{ backgroundColor: grayColor }}>
						{grayColor}
					</div>
				</div>
			</div>
			<div tw="flex flex-col gap-2 font-bold">
				自定義背景色:
				<div>
					<HexColorPicker color={backgroundColor} onChange={setBackgroundColor} />
					<div tw="mt-2 py-1 flex justify-center" style={{ backgroundColor: backgroundColor }}>
						{backgroundColor}
					</div>
				</div>
			</div>
		</div>
	)
}

export function Component() {
	return (
		<div tw="p-6 max-w-5xl">
			<h2>Radix 官方完整自訂調色盤 (Accent + Gray)</h2>
			<a
				href="https://www.radix-ui.com/colors/custom"
				tw="hover:underline accent-accent"
				target="_blank"
				rel="noopener noreferrer"
			>
				https://www.radix-ui.com/colors/custom
			</a>
			<ColorPicker />
			<DarkPalette />
			<LightPalette />
		</div>
	)
}

// 輔助組件：用來漂亮地渲染 12 格色階
interface ColorRowProps {
	t: "accent" | "gray"
	// scale: string[]
	// contrastColor?: string
	isDark?: boolean
	palette: PaletteResult
}

function ColorRow({ palette, t, isDark }: ColorRowProps) {
	const steps = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
	return (
		<div tw="flex gap-1">
			{steps.map(index => {
				return <ColorCell key={index} index={index} palette={palette} t={t} isDark={isDark} />
			})}
		</div>
	)
}

interface ColorCellProps {
	palette: PaletteResult
	index: number
	isDark?: boolean
	t: "accent" | "gray"
}

function ColorCell({ palette, index, isDark, t }: ColorCellProps) {
	const { textColor, step, scale, scaleAlpha, surface, scaleWideGamut, scaleAlphaWideGamut, surfaceWideGamut } =
		useMemo(() => {
			const scale = t === "accent" ? palette.accentScale : palette.grayScale
			const scaleAlpha = t === "accent" ? palette.accentScaleAlpha : palette.grayScaleAlpha
			const surface = t === "accent" ? palette.accentSurface : palette.graySurface

			const scaleWideGamut = t === "accent" ? palette.accentScaleWideGamut : palette.grayScaleWideGamut
			const scaleAlphaWideGamut =
				t === "accent" ? palette.accentScaleAlphaWideGamut : palette.grayScaleAlphaWideGamut
			const surfaceWideGamut = t === "accent" ? palette.accentSurfaceWideGamut : palette.graySurfaceWideGamut

			const step = index + 1

			let textColor = isDark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.8)"
			if (step >= 9 && step <= 10 && palette.accentContrast) {
				textColor = palette.accentContrast
			} else if (step > 10) {
				textColor = isDark ? "rgba(0,0,0,0.8)" : "rgba(255,255,255,0.9)"
			}

			return {
				scale: scale[index],
				scaleAlpha: scaleAlpha[index],
				surface: surface[index],
				scaleWideGamut: scaleWideGamut[index],
				scaleAlphaWideGamut: scaleAlphaWideGamut[index],
				surfaceWideGamut: surfaceWideGamut[index],
				step,
				textColor,
			}
		}, [palette, index, isDark, t])

	return (
		<Dialog>
			<DialogTrigger>
				<div
					tw="cursor-pointer transition-colors hover:(ring-2 ring-offset-2 ring-offset-custom-9 ring-custom-11)"
					style={{
						backgroundColor: scale,
						color: textColor,
						flex: 1,
						height: "72px",
						padding: "6px",
						borderRadius: "6px",
						display: "flex",
						flexDirection: "column",
						justifyContent: "space-between",
						border: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.05)",
						boxSizing: "border-box",
					}}
				>
					<strong>{step}</strong>
					<span tw="text-xs font-mono text-ellipsis overflow-hidden uppercase">{scale}</span>
				</div>
			</DialogTrigger>
			<DialogContent tw="p-0">
				<div>
					<div tw="h-48" style={{ backgroundColor: scale }} />
					<div tw="px-3 pb-5">
						<div tw="font-bold pt-3 capitalize">
							{t} {step}
						</div>
						<hr tw="my-4" />
						<div tw="font-semibold text-sm grid gap-x-7 gap-y-2 [grid-template-columns: auto 1fr]">
							<div>Solid color</div>
							<div tw="uppercase">{scale}</div>
							<div>Alpha color</div>
							<div tw="uppercase">{scaleAlpha}</div>
							<div>P3 color</div>
							<div>{scaleWideGamut}</div>
							<div>P3 alpha</div>
							<div>{scaleAlphaWideGamut}</div>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
