export default {
	darkMode: "class",
	theme: {
		fontFamily: {
			sans: [
				"var(--font-sans,_)",
				"-apple-system",
				"BlinkMacSystemFont",
				"ui-sans-serif",
				"system-ui",
				"sans-serif",
				"Apple Color Emoji",
				"Segoe UI Emoji",
				"Segoe UI Symbol",
				"Noto Color Emoji",
			],
			serif: ["var(--font-serif,_)", "ui-serif", "Georgia", "Cambria", "Times New Roman", "Times", "serif"],
			mono: [
				"var(--font-mono,_)",
				"Cascadia Code PL",
				"Cascadia Code",
				"ui-monospace",
				"SFMono-Regular",
				"Menlo",
				"Monaco",
				"Consolas",
				"Liberation Mono",
				"Courier New",
				"monospace",
			],
		},
		extend: {
			screens: {
				lg: "1025px",
			},
			container: {
				center: true,
				padding: "2rem",
				screens: {
					"2xl": "1400px",
				},
			},
			colors: {
				custom: {
					1: "var(--custom-1)",
					2: "var(--custom-2)",
					3: "var(--custom-3)",
					4: "var(--custom-4)",
					5: "var(--custom-5)",
					6: "var(--custom-6)",
					7: "var(--custom-7)",
					8: "var(--custom-8)",
					9: "var(--custom-9)",
					10: "var(--custom-10)",
					11: "var(--custom-11)",
					12: "var(--custom-12)",
					a1: "var(--custom-a1)",
					a2: "var(--custom-a2)",
					a3: "var(--custom-a3)",
					a4: "var(--custom-a4)",
					a5: "var(--custom-a5)",
					a6: "var(--custom-a6)",
					a7: "var(--custom-a7)",
					a8: "var(--custom-a8)",
					a9: "var(--custom-a9)",
					a10: "var(--custom-a10)",
					a11: "var(--custom-a11)",
					a12: "var(--custom-a12)",
				},
				border: "var(--border)",
				input: "var(--input)",
				ring: "var(--ring)",
				background: "var(--background)",
				foreground: "var(--foreground)",
				primary: {
					DEFAULT: "var(--primary)",
					foreground: "var(--primary-foreground)",
				},
				secondary: {
					DEFAULT: "var(--secondary)",
					foreground: "var(--secondary-foreground)",
				},
				destructive: {
					DEFAULT: "var(--destructive)",
					foreground: "var(--destructive-foreground)",
				},
				muted: {
					DEFAULT: "var(--muted)",
					foreground: "var(--muted-foreground)",
				},
				accent: {
					DEFAULT: "var(--accent)",
					foreground: "var(--accent-foreground)",
				},
				popover: {
					DEFAULT: "var(--popover)",
					foreground: "var(--popover-foreground)",
				},
				card: {
					DEFAULT: "var(--card)",
					foreground: "var(--card-foreground)",
				},
			},
			borderColor: {
				DEFAULT: "var(--border)",
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			keyframes: {
				enter: {
					from: { opacity: "0.1" },
					to: { opacity: "var(--enter-opacity, 1)" },
				},
			},
			animation: {
				enter: "enter 200ms ease",
			},
			customLineHeight: {
				"1": 1,
				"2": 1.25,
				"3": 1.33333,
				"4": 1.5,
			},
		},
	},
	plugins: [
		({ addVariant }) => {
			addVariant("mobile", "@media (pointer: coarse)")
			addVariant("not-mobile", "@media not (pointer: coarse)")
		},
		({ theme, matchUtilities }) => {
			matchUtilities(
				{
					"line-height"(value) {
						return {
							lineHeight: value,
						}
					},
				},
				{ values: theme("customLineHeight") },
			)
		},
	],
} satisfies import("twobj").ConfigJS
