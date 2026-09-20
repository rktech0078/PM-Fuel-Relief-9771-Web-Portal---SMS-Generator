import type { Metadata, Viewport } from "next";
import { Noto_Nastaliq_Urdu } from "next/font/google";
import "./globals.css";

const notoNastaliqUrdu = Noto_Nastaliq_Urdu({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-urdu",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#01411C",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const siteUrl = "https://fuelrelief9771.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "⛽ فیول ریلیف ایس ایم ایس پورٹل 9771 | مفت رجسٹریشن ٹول",
    template: "%s | فیول ریلیف پورٹل 9771",
  },
  description:
    "100 روپے فی لیٹر پٹرول ریلیف کے لیے 9771 پر خودکار رجسٹریشن میسج تیار کرنے کا عوامی پورٹل۔ موٹر سائیکل، رکشہ اور 800cc گاڑیوں کے لیے مفت ٹول۔",
  applicationName: "فیول ریلیف 9771 پورٹل",
  keywords: [
    "PM Fuel Relief 9771",
    "Fuel Relief Pakistan",
    "9771 SMS Registration",
    "Petrol Subsidy Pakistan",
    "پٹرول ریلیف 9771",
    "وزیراعظم فیول ریلیف اسکیم",
    "فیول ریلیف پورٹل",
    "9771 میسج جنریٹر",
    "پٹرول سبسڈی پاکستان",
    "800cc کار فیول ریلیف",
    "موٹرسائیکل پٹرول ریلیف",
  ],
  authors: [{ name: "عوامی خدمت پروجیکٹ (غیر سرکاری)" }],
  creator: "عوامی خدمت پروجیکٹ",
  publisher: "فیول ریلیف 9771",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "ur_PK",
    url: siteUrl,
    title: "⛽ فیول ریلیف ایس ایم ایس پورٹل 9771 | 100 روپے فی لیٹر سبسڈی",
    description:
      "موٹر سائیکل، رکشہ اور 800cc گاڑیوں کے لیے 9771 پر خودکار رجسٹریشن میسج بنائیں اور ایک کلک میں بھیجیں۔",
    siteName: "فیول ریلیف 9771 پورٹل",
    images: [
      {
        url: "/icon.svg",
        width: 512,
        height: 512,
        alt: "فیول ریلیف 9771 لوگو",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "⛽ فیول ریلیف ایس ایم ایس پورٹل 9771",
    description: "9771 پر پٹرول ریلیف رجسٹریشن کے لیے آسان اور خودکار میسج جنریٹر ٹول۔",
    images: ["/icon.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⛽</text></svg>",
    shortcut: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⛽</text></svg>",
    apple: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⛽</text></svg>",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Structured Data Schema for Google Search
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "فیول ریلیف ایس ایم ایس پورٹل 9771",
    url: siteUrl,
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    description:
      "100 روپے فی لیٹر پٹرول ریلیف کے لیے 9771 پر خودکار رجسٹریشن میسج تیار کرنے کا عوامی پورٹل۔",
    inLanguage: "ur",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "PKR",
    },
  };

  return (
    <html lang="ur" dir="rtl" className={`${notoNastaliqUrdu.variable} scroll-smooth`}>
      <head>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⛽</text></svg>"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased selection:bg-emerald-800 selection:text-amber-200">
        {children}
      </body>
    </html>
  );
}
