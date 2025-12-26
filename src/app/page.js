import HomeClient from './HomeClient';

export const metadata = {
  title: 'Find Your Perfect Match - Trusted Matrimony Platform',
  description: 'Register on our matrimony website to find your perfect life partner. Browse verified profiles, connect with matches, and start your journey to marriage.',
  keywords: 'matrimony, marriage, matchmaking, life partner, brides, grooms, wedding, find partner, matrimonial service',
  authors: [{ name: 'Matrimony Website' }],
  openGraph: {
    title: 'Find Your Perfect Match - Trusted Matrimony Platform',
    description: 'Register on our matrimony website to find your perfect life partner. Browse verified profiles and connect with matches.',
    url: 'https://yourdomain.com',
    siteName: 'Matrimony Website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Matrimony Website - Find Your Perfect Match',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Find Your Perfect Match - Trusted Matrimony Platform',
    description: 'Register on our matrimony website to find your perfect life partner.',
    images: ['/og-image.jpg'],
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
};

export default function Home() {
  return <HomeClient />;
}