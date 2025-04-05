import { Inter } from 'next/font/google';
import './globals.css';
import type { Metadata } from 'next';
import SupabaseProvider from '@/components/supabase-provider';
import { NavBar } from '@/components/navbar';
import { Footer } from '@/components/footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Fancrush - Talkline',
  description: 'AI-powered voice conversations with your favorite influencers',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SupabaseProvider>
          <div className="relative flex min-h-screen flex-col">
            <NavBar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </SupabaseProvider>
      </body>
    </html>
  );
} 