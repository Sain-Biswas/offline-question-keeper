"use client";

import { useHotkey } from "@tanstack/react-hotkeys";
import { useTheme } from "next-themes";
import type { ReactNode } from "react";

export default function RootTemplate({ children }: { children: ReactNode }) {
	const { resolvedTheme, setTheme } = useTheme();

	useHotkey("Mod+D", () =>
		setTheme(resolvedTheme === "dark" ? "light" : "dark")
	);

	return children;
}
