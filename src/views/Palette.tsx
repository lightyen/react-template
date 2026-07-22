import { useMemo, useState } from "react"
import { generateRadixColors } from "../generate-radix-colors"

export function Component() {
	const [accentColor, setAccentColor] = useState("#3D63DD") // 使用者自定義的主色 (例如藍色)
	const [grayColor, setGrayColor] = useState("#8B8D98") // 使用者自定義的灰色
	// const [backgroundColor, setBackgroundColor] = useState("#111111")

	// 一次算出主色與灰階
	const palette = useMemo(() => {
		try {
			const dark = generateRadixColors({
				appearance: "dark",
				accent: accentColor,
				gray: grayColor,
				background: "#111111", // Dark mode 底色
			})
			const light = generateRadixColors({
				appearance: "light",
				accent: accentColor,
				gray: grayColor,
				background: "#ffffff", // Light mode 底色
			})
			return { light, dark }
		} catch (error) {
			console.error("色彩生成失敗:", error)
			return null
		}
	}, [accentColor, grayColor])

	if (!palette) return <div>色彩格式有誤，請檢查輸入...</div>

	return (
		<div style={{ padding: "24px", fontFamily: "system-ui", maxWidth: "1000px", margin: "0 auto" }}>
			<h2>Radix 官方完整自訂調色盤 (Accent + Gray)</h2>
			<a
				href="https://www.radix-ui.com/colors/custom"
				tw="hover:underline accent-accent"
				target="_blank"
				rel="noopener noreferrer"
			>
				https://www.radix-ui.com/colors/custom
			</a>
			<div
				style={{
					display: "flex",
					gap: "24px",
					marginBottom: "32px",
					padding: "16px",
					borderRadius: "8px",
				}}
			>
				<label style={{ display: "flex", flexDirection: "column", gap: "8px", fontWeight: "bold" }}>
					自定義主色 (Accent):
					<div style={{ display: "flex", gap: "8px" }}>
						<input type="color" value={accentColor} onChange={e => setAccentColor(e.target.value)} />
						<input
							type="text"
							value={accentColor}
							onChange={e => setAccentColor(e.target.value)}
							style={{ width: "80px" }}
						/>
					</div>
				</label>

				<label style={{ display: "flex", flexDirection: "column", gap: "8px", fontWeight: "bold" }}>
					自定義灰色 (Gray):
					<div style={{ display: "flex", gap: "8px" }}>
						<input type="color" value={grayColor} onChange={e => setGrayColor(e.target.value)} />
						<input
							type="text"
							value={grayColor}
							onChange={e => setGrayColor(e.target.value)}
							style={{ width: "80px" }}
						/>
					</div>
				</label>
			</div>
			<section tw="my-10">
				<h3 tw="text-xl font-bold">Dark Mode</h3>
				<hr tw="my-2" />
				<div style={{ marginBottom: "16px" }}>
					<h4 style={{ margin: "8px 0" }}>Accent Scale</h4>
					<ColorRow
						scale={palette.dark.accentScale}
						contrastColor={palette.dark.accentContrast}
						isDark={true}
					/>
				</div>
				<div>
					<h4 tw="py-2">Gray Scale</h4>
					<ColorRow scale={palette.dark.grayScale} isDark={true} />
				</div>
			</section>
			<section tw="my-10">
				<h3 tw="text-xl font-bold">Light Mode</h3>
				<hr tw="my-2" />
				<div style={{ marginBottom: "16px" }}>
					<h4 style={{ margin: "8px 0" }}>Accent Scale</h4>
					<ColorRow
						scale={palette.light.accentScale}
						contrastColor={palette.light.accentContrast}
						isDark={false}
					/>
				</div>
				<div>
					<h4 style={{ margin: "8px 0" }}>Gray Scale</h4>
					<ColorRow scale={palette.light.grayScale} isDark={false} />
				</div>
			</section>
		</div>
	)
}

// 輔助組件：用來漂亮地渲染 12 格色階
interface ColorRowProps {
	scale: string[]
	contrastColor?: string
	isDark: boolean
}

function ColorRow({ scale, contrastColor, isDark }: ColorRowProps) {
	return (
		<div style={{ display: "flex", gap: "4px" }}>
			{scale.map((hexColor, index) => {
				const step = index + 1

				// 決定卡片文字顏色：
				// Step 9 比較特殊，使用官方傳過來的完美對比色。其餘的：暗色主題用白字，亮色主題用黑字。
				let textColor = isDark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.8)"
				if (step === 9 && contrastColor) {
					textColor = contrastColor
				} else if (step > 10) {
					textColor = isDark ? "#ffffff" : "#000000" // 文字色階給予極高對比
				}

				return (
					<div
						key={index}
						style={{
							backgroundColor: hexColor,
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
						<span tw="text-xs font-mono text-ellipsis overflow-hidden uppercase">{hexColor}</span>
					</div>
				)
			})}
		</div>
	)
}
