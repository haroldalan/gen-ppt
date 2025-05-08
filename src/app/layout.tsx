'use client'
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 3,
    },
  },
})

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="bg-background antialiased min-h-screen flex flex-col">
        <QueryClientProvider client={queryClient}>
          <Header />
          <main className="flex-1 pt-16">
            {children}
          </main>
          <Footer />
        </QueryClientProvider>
      </body>
    </html>
  )
}

