import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'تماس با رزرواسیون و مدیریت هتل تابان تهران | پشتیبانی ۲۴ ساعته',
  description: 'ارتباط مستقیم با مدیر و پذیرش هتل تابان تهران (۰۹۳۵۷۱۲۲۹۷۸)، نشانی دفتر مرکزی در میدان فردوسی، پشتیبانی تلگرام و واتساپ ۲۴ ساعته.',
  alternates: {
    canonical: 'https://tehranroom.com/contact',
  },
  openGraph: {
    title: 'تماس با رزرواسیون هتل تابان و تهران‌روم',
    description: 'خط مستقیم مدیر و پذیرش: ۰۹۳۵۷۱۲۲۹۷۸ | آدرس: تهران، میدان فردوسی، کوچه شاهرود، پلاک ۱',
    url: 'https://tehranroom.com/contact',
  },
  other: {
    'geo.placename': 'تهران، میدان فردوسی، کوچه شاهرود، پلاک ۱',
    'geo.region': 'IR-07',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const contactJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'دفتر رزرواسیون تهران‌روم و هتل تابان',
    image: 'https://store.snapptrip.com/domestic-hotel/800x460/2594/fc1ba796-5ec0-4658-8c9a-00c53a2b7348.jpeg',
    telephone: '+989357122978',
    email: 'info@tehranroom.com',
    url: 'https://tehranroom.com/contact',
    hasMap: 'https://maps.app.goo.gl/hmhZz2Xv6CSnqX3x8',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'خیابان انقلاب، ضلع غربی میدان فردوسی، کوچه شاهرود، پلاک ۱',
      addressLocality: 'تهران',
      addressRegion: 'تهران',
      addressCountry: 'IR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 35.7022,
      longitude: 51.4179,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      opens: '00:00',
      closes: '23:59',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
      />
      {children}
    </>
  );
}
