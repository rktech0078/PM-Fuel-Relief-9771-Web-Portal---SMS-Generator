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

const siteUrl = "https://pm-fuel-relief.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "فیول ریلیف پورٹل 9771",
    template: "%s | فیول ریلیف پورٹل 9771",
  },
  description:
    "100 روپے فی لیٹر پٹرول ریلیف کے لیے 9771 پر خودکار رجسٹریشن میسج تیار کریں۔ موٹر سائیکل، رکشہ اور 800cc گاڑیوں کے لیے مفت عوامی پورٹل۔",
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
  authors: [{ name: "عوامی خدمت پروجیکٹ" }],
  creator: "عوامی خدمت پروجیکٹ",
  publisher: "فیول ریلیف 9771",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "ur_PK",
    url: siteUrl,
    title: "⛽ وزیراعظم فیول ریلیف پورٹل | 100 روپے فی لیٹر سبسڈی",
    description:
      "موٹر سائیکل، رکشہ اور 800cc گاڑیوں کے لیے 9771 پر خودکار رجسٹریشن میسج بنائیں اور ایک کلک میں بھیجیں۔",
    siteName: "فیول ریلیف 9771 پورٹل",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "فیول ریلیف 9771 بینر",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "⛽ وزیراعظم فیول ریلیف پورٹل | 9771 ایس ایم ایس جنریٹر",
    description: "9771 پر پٹرول ریلیف رجسٹریشن کے لیے آسان اور خودکار میسج جنریٹر ٹول۔",
    images: ["/opengraph-image"],
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
        <meta property="og:image" content="https://pm-fuel-relief.vercel.app/opengraph-image" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:image" content="https://pm-fuel-relief.vercel.app/opengraph-image" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(reg) { console.log('SW registered:', reg.scope); })
                    .catch(function(err) { console.warn('SW registration failed:', err); });
                });
              }
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased selection:bg-emerald-800 selection:text-amber-200">
        {children}
      </body>
    </html>
  );
}
