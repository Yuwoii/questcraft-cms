import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Script from "next/script"
import { NextAuthSessionProvider } from "@/components/providers/session-provider"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "QuestCraft CMS",
  description: "Content Management System for QuestCraft Rewards",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthSessionProvider>
          {children}
        </NextAuthSessionProvider>
        
        {/* Google API Client Library */}
        <Script
          src="https://apis.google.com/js/api.js"
          strategy="afterInteractive"
          async
        />
        
        {/* Google Identity Services */}
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="afterInteractive"
          async
        />
      </body>
    </html>
  )
}
