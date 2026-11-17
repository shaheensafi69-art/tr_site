import type { Metadata } from 'next';
import { Vazirmatn } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FloatingSupport from '@/components/layout/FloatingSupport';
import { CurrencyProvider } from '@/lib/currency/currency-context';

const vazirmatn = Vazirmatn({
  subsets: ['arabic', 'latin'],
  variable: '--font-vazirmatn',
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
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
    'رزرو ساعتی هتل تهران',
    'هتل ارزان تهران',
    'هتل لوکس تهران',
    'رزرو هتل با کارت به کارت',
    'تهران روم',
    'tehranroom',
  ],
  authors: [{ name: 'TehranRoom Platform' }],
  openGraph: {
    title: 'TehranRoom | اقامت ایده‌آل شما در تهران، فقط چند کلیک فاصله دارد',
    description:
      'سامانه رزرواسیون لوکس هتل تابان و هتل‌های برتر با رزرو روزانه و ساعتی، پشتیبانی شبانه‌روزی و پرداخت امن.',
    url: 'https://tehranroom.com',
    siteName: 'TehranRoom',
    locale: 'fa_IR',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/icon.png', sizes: '64x64', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" className={`${vazirmatn.variable} font-sans dark`}>
      <body className="bg-[#030712] text-slate-100 min-h-screen flex flex-col antialiased selection:bg-amber-400 selection:text-black">
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
