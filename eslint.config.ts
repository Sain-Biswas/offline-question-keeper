import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import { importX } from "eslint-plugin-import-x";
import prettier from "eslint-config-prettier/flat";
import tsParser from "@typescript-eslint/parser";

const eslintConfig = defineConfig([
	...nextVitals,
	...nextTs,

	importX.configs["flat/recommended"],
	importX.configs["flat/typescript"],
	importX.configs["flat/react"],

	{
		files: ["**/*.{js,mjs,cjs,jsx,mjsx,ts,mts,cts,tsx,mtsx}"],

		languageOptions: {
			parser: tsParser,
			ecmaVersion: "latest",
			sourceType: "module"
		},

		rules: {
			"import/consistent-type-specifier-style": [
				"error",
				"prefer-top-level"
			],
			"import/first": "error",
			"import/newline-after-import": "error",
			"import/no-commonjs": "error",
			"import/no-duplicates": "error"
		}
	},

	{
		settings: {
			react: {
				version: "19"
			}
		}
	},

	prettier,

	globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"])
]);

export default eslintConfig;
