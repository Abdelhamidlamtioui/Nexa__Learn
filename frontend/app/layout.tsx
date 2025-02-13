import { ThemeProvider } from "@/contexts/theme-context"
import { Footer } from "@/components/footer"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <ThemeProvider>
          <main className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}

import './globals.css'