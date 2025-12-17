import type { Metadata } from 'next';
import '@/styles/variables.css';

export const metadata: Metadata = {
  title: 'Monthly Calendar View',
  description: 'Interactive monthly calendar with event management',
  authors: [{ name: 'Development Team' }],
  keywords: ['calendar', 'events', 'monthly view', 'scheduling'],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    minimumScale: 1,
    userScalable: true,
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
    { media: '(prefers-color-scheme: dark)', color: '#1F2937' },
  ],
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): JSX.Element {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="color-scheme" content="light dark" />
      </head>
      <body>
        <main id="main-content">{children}</main>
      </body>
    </html>
  );
}
