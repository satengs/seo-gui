import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import Sidebar from '@/components/sidebar';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Search Analytics Dashboard',
  description: 'Advanced search analytics and competitor tracking dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
    <head>
      <title>Search Analytics</title>
      <link rel="icon" type="image/ico" href="/favicon.ico"/>
      <link rel="icon" type="image/svg+xml" href="/icon.svg" />
      <link rel="shortcut icon" href="/favicon.ico" />
      <link
          rel="apple-touch-icon"
          type="image/png"
          href="/apple-icon.png"
      />
      <link rel="manifest" href="/manifest.json" />
    </head>

      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col">
              <Header />
              <main className="flex-1 overflow-y-auto bg-background">
                {children}
              </main>
            </div>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
