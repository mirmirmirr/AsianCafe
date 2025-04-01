import { geistSans, euphoria } from '@/app/ui/styles/fonts';
import { SpeedInsights } from '@vercel/speed-insights/next';
import '@/app/ui/styles/globals.css';
import Header from '@/app/ui/layout/header';
import StatusBanner from '@/app/ui/layout/status-banner';
import { OrderProvider } from '@/app/ui/menu/OrderContext';
import Head from 'next/head';

export const metadata = {
  title: 'Asian Cafe',
  description: 'Asian Cafe Fayetteville',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.className} ${euphoria.variable} antialiased`}>
        <OrderProvider>
          <StatusBanner />
          <Header />
          <div className='p-8'>
            {children}
            <SpeedInsights />
            <footer className="flex mt-2 h-[30px] gap-6 flex-wrap items-center justify-center">
              <p>&#169; 2025 Asian Cafe Asian Restaurant</p>
            </footer>
          </div>
        </OrderProvider>
      </body>
    </html>
  );
}