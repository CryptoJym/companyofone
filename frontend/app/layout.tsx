import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Company of One - Scale Your Business Without Scaling Your Team",
  description: "The complete operating system for solopreneurs. Get AI assistants, strategic consulting, and proven systems to 10x your output while working less. Join 1,000+ thriving one-person businesses.",
  keywords: "solopreneur tools, one person business, scale without employees, solopreneur consulting, AI for small business, business automation, solopreneur community, grow without hiring",
  authors: [{ name: "Company of One" }],
  openGraph: {
    title: "Company of One - Scale Your Business Without Scaling Your Team",
    description: "The complete operating system for solopreneurs. Get AI assistants, strategic consulting, and proven systems to 10x your output while working less.",
    type: "website",
    locale: "en_US",
    siteName: "Company of One",
  },
  twitter: {
    card: "summary_large_image",
    title: "Company of One - Scale Your Business Without Scaling Your Team",
    description: "The complete operating system for solopreneurs. Get AI assistants, strategic consulting, and proven systems to 10x your output while working less.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
