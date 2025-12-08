import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { AuthButton } from "@/components/auth-button"; 
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { NavButtons } from "@/components/nav-buttons";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        {/* header with auth button*/}
       <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        >
      <div style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
      }}>
      <header className="w-full border-b">
        <div className="flex">
          <NavButtons/>
          <div className="ml-auto max-w-6xl py-3 px-4 flex items-center gap-4">
            <div style={{color: "black",}} className="font-semibold">Spark!Bytes</div>
            
            <AuthButton /> {/* this is the new button */}
          </div>
        </div>
      </header>

      <div style={{flex: 1}}>{children}</div>

      <footer style={{ backgroundColor: "#CC0000", color: "#E0E0E0", textAlign: "center",
        padding: "16px 0", fontWeight: "500", boxShadow: "0 -2px 8px rgba(0,0,0,0.2)"
      }}>
          © 2025 Spark!Bytes. All rights reserved.
      </footer>
      </div>
      </ThemeProvider>

      </body>
    </html>
  );
}
