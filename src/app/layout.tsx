import type { Metadata, Viewport } from 'next';
import { Vazirmatn } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FloatingSupport from '@/components/layout/FloatingSupport';
import { CurrencyProvider } from '@/lib/currency/currency-context';
import PwaRegister from '@/components/pwa/PwaRegister';

const vazirmatn = Vazirmatn({
  subsets: ['arabic', 'latin'],
  variable: '--font-vazirmatn',
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#030712',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://tehranroom.com'),
  manifest: '/manifest.json',
  title: {
    template: '%s | TehranRoom - پلتفرم لوکس رزرو هتل',
    default: 'TehranRoom | سامانه رزرو آنلاین هتل‌های برتر تهران و ایران',
  },
  description:
    'رزرو آنلاین و لحظه‌ای اتاق‌های هتل تابان تهران و برترین هتل‌های ایران. رزرو روزانه و ساعتی با تضمین بهترین قیمت، تایید فوری، پرداخت آسان کارت‌به‌کارت و پشتیبانی ۲۴ ساعته.',
  keywords: [
    'رزرو هتل در تهران',
    'رزرو هتل تابان تهران',
    'هتل تابان',
    'هتل تابان میدان فردوسی',
    'رزرو ساعتی هتل تهران',
    'هتل ارزان تهران',
    'هتل لوکس تهران',
    'رزرو آنلاین هتل فردوسی',
    'رزرو هتل با کارت به کارت',
    'تهران روم',
    'tehranroom',
    'hotel taban tehran',
  ],
  authors: [{ name: 'TehranRoom Platform', url: 'https://tehranroom.com' }],
  alternates: {
    canonical: 'https://tehranroom.com',
    languages: {
      'fa-IR': 'https://tehranroom.com',
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'تهران‌روم',
  },
  formatDetection: {
    telephone: true,
  },
  openGraph: {
    title: 'TehranRoom | اقامت ایده‌آل شما در تهران، فقط چند کلیک فاصله دارد',
    description:
      'سامانه رزرواسیون لوکس هتل تابان و هتل‌های برتر با رزرو روزانه و ساعتی، پشتیبانی شبانه‌روزی و پرداخت امن.',
    url: 'https://tehranroom.com',
    siteName: 'TehranRoom',
    locale: 'fa_IR',
    type: 'website',
    images: [
      {
        url: 'https://store.snapptrip.com/domestic-hotel/800x460/2594/fc1ba796-5ec0-4658-8c9a-00c53a2b7348.jpeg',
        width: 800,
        height: 460,
        alt: 'هتل تابان تهران و سامانه رزرواسیون تهران‌روم',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TehranRoom | سامانه رزرو آنلاین هتل‌های تهران و ایران',
    description: 'رزرو لحظه‌ای هتل تابان تهران با نرخ مصوب، تایید فوری و واچر الکترونیکی معتبر.',
    images: ['https://store.snapptrip.com/domestic-hotel/800x460/2594/fc1ba796-5ec0-4658-8c9a-00c53a2b7348.jpeg'],
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
  verification: {
    google: 'google697fddfdc0276823',
  },
  other: {
    'geo.region': 'IR-07',
    'geo.placename': 'تهران، میدان فردوسی',
    'geo.position': '35.7022;51.4179',
    'ICBM': '35.7022, 51.4179',
    'DC.title': 'سامانه رزرواسیون هتل‌های تهران‌روم',
  },
  icons: {
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const globalSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://tehranroom.com/#website',
        url: 'https://tehranroom.com',
        name: 'تهران‌روم',
        description: 'سامانه رزرواسیون آنلاین لوکس‌ترین هتل‌های تهران و ایران',
        inLanguage: 'fa-IR',
        publisher: {
          '@id': 'https://tehranroom.com/#organization',
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://tehranroom.com/hotels?q={search_term_string}',
          },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        '@id': 'https://tehranroom.com/#organization',
        name: 'TehranRoom | تهران‌روم',
        url: 'https://tehranroom.com',
        logo: {
          '@type': 'ImageObject',
          url: 'https://tehranroom.com/icon-512.png',
          width: 512,
          height: 512,
        },
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+989357122978',
          contactType: 'customer service',
          areaServed: 'IR',
          availableLanguage: ['Persian', 'English'],
        },
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'خیابان انقلاب، ضلع غربی میدان فردوسی، کوچه شاهرود، پلاک ۱',
          addressLocality: 'تهران',
          addressRegion: 'تهران',
          addressCountry: 'IR',
        },
      },
    ],
  };
  return (
    <html lang="fa" dir="rtl" className={`${vazirmatn.variable} font-sans dark`}>
      <head>
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="application-name" content="تهران‌روم" />
        <meta name="mobile-web-app-capable" content="yes" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(globalSchema) }}
        />
      </head>
      <body className="bg-[#030712] text-slate-100 min-h-screen flex flex-col antialiased selection:bg-amber-400 selection:text-black">
        <PwaRegister />
        <CurrencyProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <FloatingSupport />
          <Footer />
        </CurrencyProvider>
      </body>
    </html>
  );
}
