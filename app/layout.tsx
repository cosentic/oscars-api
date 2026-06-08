import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OscarBase API — Academy Awards Data for Developers",
  description: "Free public REST API with complete Academy Awards data from 1929 to present. Every nomination, winner, film, and filmmaker — queryable in milliseconds.",
  keywords: "Oscar API, Academy Awards API, Oscar data, Academy Awards database, film awards API, Oscar nominations API",
  openGraph: {
    title: "OscarBase API — Academy Awards Data for Developers",
    description: "Free public REST API with complete Academy Awards data from 1929 to present.",
    url: "https://api.oscarbase.com",
    siteName: "OscarBase",
    type: "website",
    images: [
      {
        url: "https://api.oscarbase.com/oscarbase-logo.png",
        width: 1200,
        height: 630,
        alt: "OscarBase API",
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "OscarBase API — Academy Awards Data for Developers",
    description: "Free public REST API with complete Academy Awards data from 1929 to present.",
    images: ["https://api.oscarbase.com/oscarbase-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://api.oscarbase.com",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}