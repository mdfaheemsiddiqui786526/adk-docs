import type { Metadata } from 'next';
import { NextSeo } from 'next-seo';
import './styles/globals.css';

export const metadata: Metadata = {
  title: {
    default: 'VELBERS - Premium Shoes India',
    template: '%s | VELBERS',
  },
  description: 'Discover luxury premium shoes in India. Shop the latest collections from top brands. Fast shipping, authentic products, best prices.',
  keywords: 'shoes, premium shoes, luxury shoes, India, online shopping, footwear',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://velbers.com',
    siteName: 'VELBERS',
    title: 'VELBERS - Premium Shoes India',
    description: 'Discover luxury premium shoes in India',
    images: [
      {
        url: 'https://velbers.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'VELBERS - Premium Shoes',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
