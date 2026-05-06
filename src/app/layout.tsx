import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";

// Import fonts
import "@fontsource/space-grotesk/700.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/600.css";

import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Around You | Your campus. All connected.",
  description: "The single home for campus chat, marketplace, events, and lost & found.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
