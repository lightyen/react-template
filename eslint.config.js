import eslint from "@eslint/js"
import tseslint from "typescript-eslint"

export default tseslint.config(eslint.configs.recommended, ...tseslint.configs.recommendedTypeChecked, {
	ignores: ["**/tailwind.config.js", "**/eslint.config.js"],
	languageOptions: {
		parserOptions: {
			project: "./tsconfig.json",
			projectService: {
				defaultProject: "./tsconfig.json",
			},
			tsconfigRootDir: import.meta.dirname,
		},
	},
})

// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)

// const compat = new FlatCompat({
// 	baseDirectory: __dirname,
// 	recommendedConfig: eslint.configs.recommended,
// 	allConfig: eslint.configs.all,
// })

// export vv = [
// 	{
// 		ignores: ["**/tailwind.config.js"],
// 	},
// 	...compat.extends(
// 		"eslint:recommended",
// 		"plugin:@typescript-eslint/eslint-recommended",
// 		"plugin:@typescript-eslint/recommended",
// 	),
// 	{
// 		plugins: {
// 			"@typescript-eslint": tseslint,
// 		},

// 		languageOptions: {
// 			globals: {
// 				...globals.browser,
// 				...globals.node,
// 			},

// 			parser: tsParser,
// 			ecmaVersion: 5,
// 			sourceType: "commonjs",

// 			parserOptions: {
// 				project: "./tsconfig.json",
// 			},
// 		},

// 		rules: {
// 			"spaced-comment": "error",
// 			"no-var": "error",
// 			"no-extra-bind": "error",
// 			"no-mixed-spaces-and-tabs": ["warn", "smart-tabs"],

// 			"no-empty": [
// 				"warn",
// 				{
// 					allowEmptyCatch: true,
// 				},
// 			],

// 			"no-empty-pattern": "off",

// 			"@typescript-eslint/no-unused-vars": [
// 				"warn",
// 				{
// 					vars: "all",
// 					argsIgnorePattern: "^_",
// 					ignoreRestSiblings: true,
// 					caughtErrors: "none",
// 				},
// 			],

// 			"@typescript-eslint/no-empty-interface": "off",
// 			"@typescript-eslint/no-empty-function": "warn",
// 			"@typescript-eslint/camelcase": "off",
// 			"@typescript-eslint/explicit-function-return-type": "off",
// 			"@typescript-eslint/array-type": "off",
// 			"@typescript-eslint/no-var-requires": "off",

// 			"@typescript-eslint/member-delimiter-style": [
// 				"error",
// 				{
// 					multiline: {
// 						delimiter: "none",
// 					},

// 					singleline: {
// 						delimiter: "semi",
// 						requireLast: false,
// 					},
// 				},
// 			],

// 			"@typescript-eslint/explicit-module-boundary-types": "off",

// 			"@typescript-eslint/ban-types": [
// 				"error",
// 				{
// 					extendDefaults: true,

// 					types: {
// 						"{}": false,
// 					},
// 				},
// 			],
// 		},
// 	},
// ]
