import type { Metadata } from "next";
import { Geist_Mono, Space_Grotesk } from "next/font/google";
import { cn } from "~/lib/utils";
import "~/app/globals.css";
import { Toaster } from "~/shadcn/ui/toast";
import { ThemeProvider } from "~/integrations/next-themes/theme-provider";
import { TanstackDevtoolsProvider } from "~/integrations/tanstack/devtools/provider";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const spaceGrotesk = Space_Grotesk({
	subsets: ["latin"],
	variable: "--font-space-grotesk"
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"]
});

export const metadata: Metadata = {
	title: "Offline Question Keeper",
	description: "Your Personal Study Guide"
};

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			className={cn(geistMono.variable, spaceGrotesk.variable)}
			suppressHydrationWarning
		>
			<body>
				<NuqsAdapter>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
					>
						{children}
						<Toaster />
						<TanstackDevtoolsProvider />
					</ThemeProvider>
				</NuqsAdapter>
			</body>
		</html>
	);
}
