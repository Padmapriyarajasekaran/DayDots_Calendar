// app/layout.tsx
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { SnackProvider } from "./SnackProvider";
import { ThemeProvider } from "./ThemeProvider";
import BackgroundLayers from "@/components/BackgroundLayers"; // <- Import

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "700"] });

export const metadata: Metadata = {
  title: "Continuous Calendar",
  description: "A simple, fully customizable React Calendar, styled with Tailwindcss.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        {/* 🔥 Animated Gradient + Particles */}
        <BackgroundLayers />

        {/* App Content */}
        <ThemeProvider>
          <SnackProvider>
            {children}
          </SnackProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
