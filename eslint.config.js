import eslint from "@eslint/js"
import react from "eslint-plugin-react"
import reactHooks from "eslint-plugin-react-hooks"
import tseslint from "typescript-eslint"

export default tseslint.config(
	{
		ignores: ["eslint.config.js", "src/typings", "dist", "shadcn", "playwright"],
	},
	eslint.configs.recommended,
	...tseslint.configs.recommendedTypeChecked,
	...tseslint.configs.stylisticTypeChecked,
	{
		rules: {
			"no-empty": [
				"warn",
				{
					allowEmptyCatch: true,
				},
			],
			"no-extra-bind": "error",
			"no-mixed-spaces-and-tabs": ["warn", "smart-tabs"],
			"no-var": "error",
			"spaced-comment": "error",
		},
	},
	{
		plugins: {
			"@typescript-eslint": tseslint.plugin,
		},
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				project: true,
			},
		},
		rules: {
			"@typescript-eslint/array-type": "off",
			"@typescript-eslint/consistent-indexed-object-style": "off",
			"@typescript-eslint/dot-notation": "off",
			"@typescript-eslint/explicit-function-return-type": "off",
			"@typescript-eslint/explicit-module-boundary-types": "off",
			"@typescript-eslint/no-empty-function": "warn",
			"@typescript-eslint/no-empty-interface": "off",
			"@typescript-eslint/no-empty-object-type": "off",
			"@typescript-eslint/no-explicit-any": "warn",
			"@typescript-eslint/no-floating-promises": "off",
			"@typescript-eslint/no-misused-promises": [
				"warn",
				{
					checksVoidReturn: false,
				},
			],
			"@typescript-eslint/no-redundant-type-constituents": "off",
			"@typescript-eslint/no-unsafe-argument": "off",
			"@typescript-eslint/no-unsafe-assignment": "off",
			"@typescript-eslint/no-unsafe-call": "off",
			"@typescript-eslint/no-unsafe-member-access": "off",
			"@typescript-eslint/no-unsafe-return": "off",
			"@typescript-eslint/no-unused-vars": [
				"warn",
				{
					argsIgnorePattern: "^_",
					caughtErrors: "none",
					ignoreRestSiblings: true,
					vars: "all",
				},
			],
			"@typescript-eslint/prefer-function-type": "off",
			"@typescript-eslint/prefer-nullish-coalescing": "off",
			"@typescript-eslint/unbound-method": "off",
		},
	},
	{
		files: ["src/**/*.{js,ts,jsx,tsx}"],
		...react.configs.flat.recommended,
		settings: {
			react: {
				version: "detect",
			},
		},
		rules: {
			"react/no-unknown-property": ["error", { ignore: ["css", "tw"] }],
		},
	},
	{
		files: ["src/**/*.{js,ts,jsx,tsx}"],
		plugins: {
			"react-hooks": reactHooks,
		},
		rules: {
			...reactHooks.configs.recommended.rules,
		},
	},
)
