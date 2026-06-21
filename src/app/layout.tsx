import React, { Suspense } from 'react';
import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import {
  Montserrat,
  DM_Serif_Display,
  Noto_Sans_Armenian,
  Space_Grotesk,
  DM_Sans,
} from 'next/font/google';
import './globals.css';
import { ClientProviders } from '../components/ClientProviders';
import { ConditionalHeader } from '../components/ConditionalHeader';
import { Footer } from '../components/Footer';
import { MobileBottomNav } from '../components/MobileBottomNav';
import { StorefrontBackground, StorefrontMain } from '../components/StorefrontLayoutShell';

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

const wideDisplay = localFont({
  src: '../assets/fonts/Special-Gothic-Expanded-One.ttf',
  variable: '--font-wide-display',
  display: 'swap',
  weight: '400',
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

const mirageExpanded = localFont({
  src: '../assets/fonts/Mirage-Expanded.otf',
  variable: '--font-mirage',
  display: 'swap',
});

function resolveMetadataBase(): URL {
  const configured =
    process.env.NEXT_PUBLIC_APP_URL?.trim() || process.env.APP_URL?.trim();
  if (configured) {
    return new URL(configured);
  }
  if (process.env.VERCEL_URL) {
    return new URL(`https://${process.env.VERCEL_URL}`);
  }
  return new URL('http://localhost:3000');
}

export const metadata: Metadata = {
  metadataBase: resolveMetadataBase(),
  title: 'Janazyan — Premium Baby & Family Care',
  description:
    'Premium baby & family skincare crafted with love, safety and your family comfort in mind.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
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
        wideDisplay.variable,
        spaceGrotesk.variable,
        dmSans.variable,
        notoSansArmenian.variable,
        mirageExpanded.variable,
      ].join(' ')}
    >
      <body className="font-body text-ink-800 antialiased min-h-full">
        <Suspense fallback={null}>
          <ClientProviders>
            <StorefrontBackground />
            <div className="flex min-h-screen flex-col">
              <ConditionalHeader />
              <StorefrontMain>{children}</StorefrontMain>
              <Footer />
              <MobileBottomNav />
            </div>
          </ClientProviders>
        </Suspense>
      </body>
    </html>
  );
}
