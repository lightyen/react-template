import { useMemo, useState } from "react"
import { generateRadixColors } from "../generate-radix-colors"

export function Component() {
	const [accentColor, setAccentColor] = useState("#3D63DD") // 使用者自定義的主色 (例如藍色)
	const [grayColor, setGrayColor] = useState("#8B8D98") // 使用者自定義的灰色

	// 一次算出主色與灰階
	const palette = useMemo(() => {
		try {
			const light = generateRadixColors({
				appearance: "light",
				accent: accentColor,
				gray: grayColor,
				background: "#ffffff", // Light mode 底色
			})

			const dark = generateRadixColors({
				appearance: "dark",
				accent: accentColor,
				gray: grayColor,
				background: "#111111", // Dark mode 底色
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

			{/* 雙色彩選擇器 */}
			<div
				style={{
					display: "flex",
					gap: "24px",
					marginBottom: "32px",
					padding: "16px",
					backgroundColor: "#f5f5f5",
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

			{/* 1. 淺色模式區 (Light Mode) */}
			<section style={{ marginBottom: "40px" }}>
				<h3 style={{ borderBottom: "2px solid #eee", paddingBottom: "8px" }}>Light Mode</h3>

				{/* 主色色階 */}
				<div style={{ marginBottom: "16px" }}>
					<h4 style={{ margin: "8px 0" }}>Accent Scale</h4>
					<ColorRow
						scale={palette.light.accentScale}
						contrastColor={palette.light.accentContrast}
						isDark={false}
					/>
				</div>

				{/* 灰階色階 */}
				<div>
					<h4 style={{ margin: "8px 0" }}>Gray Scale (對應你的灰色)</h4>
					<ColorRow scale={palette.light.grayScale} isDark={false} />
				</div>
			</section>

			{/* 2. 深色模式區 (Dark Mode) */}
			<section style={{ padding: "24px", backgroundColor: "#09090b", color: "#fff", borderRadius: "12px" }}>
				<h3 style={{ borderBottom: "2px solid #222", paddingBottom: "8px" }}>Dark Mode</h3>

				{/* 主色色階 */}
				<div style={{ marginBottom: "16px" }}>
					<h4 style={{ margin: "8px 0" }}>Accent Scale</h4>
					<ColorRow
						scale={palette.dark.accentScale}
						contrastColor={palette.dark.accentContrast}
						isDark={true}
					/>
				</div>

				{/* 灰階色階 */}
				<div>
					<h4 style={{ margin: "8px 0" }}>Gray Scale</h4>
					<ColorRow scale={palette.dark.grayScale} isDark={true} />
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
							fontSize: "11px",
							display: "flex",
							flexDirection: "column",
							justifyContent: "space-between",
							border: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.05)",
							boxSizing: "border-box",
						}}
					>
						<strong style={{ fontSize: "12px" }}>{step}</strong>
						<span
							style={{
								fontSize: "9px",
								fontFamily: "monospace",
								overflow: "hidden",
								textOverflow: "ellipsis",
							}}
						>
							{hexColor}
						</span>
					</div>
				)
			})}
		</div>
	)
}
