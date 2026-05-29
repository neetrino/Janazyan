import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import {
  Montserrat,
  DM_Serif_Display,
  Noto_Sans_Armenian,
  Special_Gothic_Expanded_One,
  Space_Grotesk,
  DM_Sans,
} from 'next/font/google';
import './globals.css';
import { ClientProviders } from '../components/ClientProviders';
import { ConditionalHeader } from '../components/ConditionalHeader';
import { ConditionalFooter } from '../components/ConditionalFooter';
import { MobileBottomNav } from '../components/MobileBottomNav';

const montserrat = Montserrat({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-montserrat',
  display: 'swap',
});

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-display',
  display: 'swap',
});

const specialGothic = Special_Gothic_Expanded_One({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-wide-display',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-grotesk',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const notoSansArmenian = Noto_Sans_Armenian({
  subsets: ['armenian'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-armenian',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Janazyan — Premium Baby & Family Care',
  description:
    'Premium baby & family skincare crafted with love, safety and your family comfort in mind.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="hy"
      className={[
        'h-full',
        montserrat.variable,
        dmSerif.variable,
        specialGothic.variable,
        spaceGrotesk.variable,
        dmSans.variable,
        notoSansArmenian.variable,
      ].join(' ')}
    >
      <body className="font-body bg-white text-ink-800 antialiased min-h-full">
        <Suspense fallback={null}>
          <ClientProviders>
            <div className="flex min-h-screen flex-col pb-16 lg:pb-0">
              <ConditionalHeader />
              <main className="flex-1 w-full">{children}</main>
              <ConditionalFooter />
              <MobileBottomNav />
            </div>
          </ClientProviders>
        </Suspense>
      </body>
    </html>
  );
}
