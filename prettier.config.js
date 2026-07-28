/* eslint-disable import/no-anonymous-default-export */

/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
export default {
	plugins: ["prettier-plugin-tailwindcss"],
	tailwindStylesheet: "./src/app/globals.css",
	tailwindFunctions: ["cva", "cn", "clsx"],

	experimentalTernaries: true,
	experimentalOperatorPosition: "start",
	singleAttributePerLine: true,
	htmlWhitespaceSensitivity: "strict",

	semi: true,
	trailingComma: "none",
	tabWidth: 4,
	useTabs: true
};
