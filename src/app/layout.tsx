import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { JsonLd } from "@/components/JsonLd";
import { buildOrgSchema } from "@/lib/seo";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap"
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.salon5014.com"),
  icons: { icon: "/favicon.svg" },
  title: {
    default: "Salon 5014 | Dallas Hair Salon",
    template: "%s | Salon 5014"
  },
  description:
    "Salon 5014 is an elite Dallas hair salon at 5014 Miller Ave offering haircuts, balayage, color, styling and extensions. Experienced stylists in an inviting, newly renovated space. Book online or call (469) 426-4308.",
  keywords: [
    "Salon 5014",
    "Dallas hair salon",
    "balayage Dallas",
    "hair color Dallas",
    "hair extensions Dallas",
    "Lower Greenville salon"
  ],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Salon 5014 | Dallas Hair Salon",
    description:
      "Elite Dallas hair salon — haircuts, balayage, color, styling and extensions at 5014 Miller Ave. Book online or call (469) 426-4308.",
    type: "website",
    locale: "en_US",
    url: "https://www.salon5014.com",
    siteName: "Salon 5014"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <JsonLd data={buildOrgSchema()} />
        {children}
      </body>
    </html>
  );
}
