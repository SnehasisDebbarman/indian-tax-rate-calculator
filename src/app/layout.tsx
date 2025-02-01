import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Indian Tax Rate Calculator',
  description: 'Calculate your tax rates based on Indian tax slabs.',
  keywords: ['tax', 'income tax', 'india', 'calculator'],
  viewport: 'width=device-width, initial-scale=1',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Indian Tax Rate Calculator',
    description: 'Calculate your tax rates based on Indian tax slabs.',
    url: 'https://indian-tax-rate-calculator.vercel.app/',
    type: 'website',
    // images: [
    //   {
    //     url: '/path-to-your-image.jpg',
    //     width: 800,
    //     height: 600,
    //     alt: 'Indian Tax Rate Calculator',
    //   },
    // ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Indian Tax Rate Calculator',
    description: 'Calculate your tax rates based on Indian tax slabs.',
    // images: ['/path-to-your-image.jpg'],
  },

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">


      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col justify-between`}
      >
        {children}

        <footer className="text-center mb-2  w-full text-sm text-gray-500 p-2">
          &copy; {new Date().getFullYear()} Snehasis Debbarman. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
