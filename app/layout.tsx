import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import Sidebar from '@/components/sidebar';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/header';
import { headers } from 'next/headers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Search Analytics Dashboard',
    description: 'Advanced search analytics and competitor tracking dashboard',
};

export default async function RootLayout({
                                             children,
                                         }: {
    children: React.ReactNode;
}) {
    // Get the pathname from headers to determine if we're on an auth page
    const headersList = await headers();
    const pathname = await headersList.get('x-pathname') || '';
    const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');

    return (
        <html lang="en" suppressHydrationWarning>
        <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <div className="flex min-h-screen">
                {!isAuthPage && <Sidebar />}
                <div className="flex-1 flex flex-col">
                    {!isAuthPage && <Header />}
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