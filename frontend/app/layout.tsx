import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#000000',
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NODE_ENV === 'production' ? 'https://companyofone.ai' : 'http://localhost:3000'),
  title: {
    default: "Company of One - Scale Your Business Without Scaling Your Team",
    template: "%s | Company of One"
  },
  description: "The complete operating system for solopreneurs. Get AI assistants, strategic consulting, and proven systems to 10x your output while working less. Join 1,000+ thriving one-person businesses.",
  keywords: [
    "solopreneur tools",
    "one person business", 
    "scale without employees",
    "solopreneur consulting",
    "AI for small business",
    "business automation",
    "solopreneur community",
    "grow without hiring",
    "solo entrepreneur",
    "business systems",
    "productivity tools",
    "virtual assistant AI"
  ],
  authors: [{ name: "Company of One" }],
  creator: "Company of One",
  publisher: "Company of One",
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
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Company of One",
    title: "Company of One - Scale Your Business Without Scaling Your Team",
    description: "The complete operating system for solopreneurs. Get AI assistants, strategic consulting, and proven systems to 10x your output while working less.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Company of One - Scale Your Business Without Scaling Your Team",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@companyofone",
    creator: "@companyofone",
    title: "Company of One - Scale Your Business Without Scaling Your Team",
    description: "The complete operating system for solopreneurs. Get AI assistants, strategic consulting, and proven systems to 10x your output while working less.",
    images: ["/og-image.jpg"],
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#000000" },
    ],
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Structured Data
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Company of One",
    url: process.env.NODE_ENV === 'production' ? 'https://companyofone.ai' : 'http://localhost:3000',
    logo: "/logo.png",
    description: "The complete operating system for solopreneurs and one-person businesses.",
    foundingDate: "2024",
    sameAs: [
      "https://twitter.com/companyofone",
      "https://linkedin.com/company/companyofone"
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "support@companyofone.ai"
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Company of One",
    url: process.env.NODE_ENV === 'production' ? 'https://companyofone.ai' : 'http://localhost:3000',
    description: "The complete operating system for solopreneurs.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${process.env.NODE_ENV === 'production' ? 'https://companyofone.ai' : 'http://localhost:3000'}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([organizationSchema, websiteSchema], null, 2)
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://analytics.google.com" />
      </head>
      <body className={`${inter.className} ${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
