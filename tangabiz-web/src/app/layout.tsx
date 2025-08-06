import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryClientProviderWrapper from "@/providers/QueryClientProviderWrapper";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TangaBiz | Business Management for Zimbabwean SMEs",
  description:
    "TangaBiz is a powerful business management platform for small to medium-sized businesses in Zimbabwe. Manage inventory, sales, customers, and growth all in one place.",
  keywords: [
    "TangaBiz",
    "Zimbabwe POS",
    "SME software",
    "business management",
    "inventory system Zimbabwe",
    "sales tracking",
    "customer management",
    "POS Zimbabwe",
    "retail software Zim",
  ],
  openGraph: {
    title: "TangaBiz | Business Management for Zimbabwean SMEs",
    description:
      "A smart, scalable solution for managing your entire business — from inventory and sales to customers and insights.",
    url: "https://tangabiz.store",
    siteName: "TangaBiz",
    images: [
      {
        url: "https://tangabiz.store/og-image.png", 
        width: 1200,
        height: 630,
        alt: "TangaBiz Dashboard Overview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TangaBiz | Business Management for Zimbabwean SMEs",
    description:
      "Smart software for managing inventory, sales, and customers. Built for Zimbabwean businesses.",
    images: ["https://tangabiz.store/og-image.png"],
  },
  metadataBase: new URL("https://tangabiz.store"),
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-title" content="TangaBiz" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryClientProviderWrapper>
          {children}
          <Toaster richColors expand />
        </QueryClientProviderWrapper>
      </body>
    </html>
  );
}
