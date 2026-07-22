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
