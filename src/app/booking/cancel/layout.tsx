import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'سامانه استرداد وجه و لغو رزرو هتل تابان تهران | تهران‌روم',
  description: 'بررسی خودکار واجد شرایط بودن استرداد وجه رزرو هتل تابان تهران طبق بخشنامه رسمی هتلداری و ثبت شماره شبا / کارت مسافر.',
  alternates: {
    canonical: 'https://tehranroom.com/booking/cancel',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function CancelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
