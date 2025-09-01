import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Pharmarapide - Livraison rapide de médicaments au Maroc',
  description: 'Pharmarapide est une entreprise marocaine spécialisée dans la livraison rapide de médicaments. Service 24/7 pour vos besoins médicaux urgents.',
  keywords: 'pharmacie, livraison, médicaments, Maroc, urgences, pharmacie de garde, Casablanca',
  authors: [{ name: 'Pharmarapide' }],
  openGraph: {
    title: 'Pharmarapide - Livraison rapide de médicaments au Maroc',
    description: 'Service de livraison rapide de médicaments au Maroc. Disponible 24/7 pour vos urgences médicales.',
    url: 'https://pharmarapide.ma',
    siteName: 'Pharmarapide',
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pharmarapide - Livraison rapide de médicaments au Maroc',
    description: 'Service de livraison rapide de médicaments au Maroc. Disponible 24/7 pour vos urgences médicales.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning={true}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  );
}
