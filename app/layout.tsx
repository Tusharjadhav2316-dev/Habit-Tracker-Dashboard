import { Analytics } from "@vercel/analytics/next"
import type { Metadata } from "next"
import type React from "react"
import "./globals.css"
import PWARegister from "./pwa-register"

export const metadata: Metadata = {
  title: "Habit Tracker",
  description: "Created by TjTech",
  manifest: "/manifest.json",
  themeColor: "#000000",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}

        {/* Register Service Worker for PWA */}
        <PWARegister />

        <Analytics />
      </body>
    </html>
  )
}
