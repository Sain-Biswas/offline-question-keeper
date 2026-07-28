"use client";

import { TanStackDevtools } from "@tanstack/react-devtools";
import { hotkeysDevtoolsPlugin } from "@tanstack/react-hotkeys-devtools";

export function TanstackDevtoolsProvider() {
	return <TanStackDevtools plugins={[hotkeysDevtoolsPlugin()]} />;
}
