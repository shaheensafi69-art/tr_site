import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'پیگیری رزرو و دریافت واچر دیجیتال هتل تابان تهران | تهران‌روم',
  description: 'استعلام لحظه‌ای وضعیت رزرواسیون، تایید فیش واریزی، دانلود و پرینت واچر رسمی هتل تابان تهران با کد رهگیری.',
  alternates: {
    canonical: 'https://tehranroom.com/booking/track',
  },
  openGraph: {
    title: 'پیگیری رزرو و دریافت واچر رسمی | تهران‌روم',
    description: 'سامانه استعلام آنی رزرواسیون و واچر دیجیتال هتل تابان تهران.',
    url: 'https://tehranroom.com/booking/track',
  },
};

export default function TrackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
