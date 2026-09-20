import type { NextConfig } from "next";
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  /* config options here */
};

export default withPWA({
  dest: "public",          // SW + workbox files generate hote hain public/ mein
  register: true,          // SW auto register hota hai
  skipWaiting: true,       // naya SW foran activate hota hai
  disable: process.env.NODE_ENV === "development", // dev mein SW off
  buildExcludes: [/middleware-manifest\.json$/],
  runtimeCaching: [
    {
      // Google Fonts cache
      urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "google-fonts",
        expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
      },
    },
    {
      // Next.js static assets (_next/static)
      urlPattern: /^\/_next\/static\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "next-static",
        expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 365 },
      },
    },
    {
      // Next.js image optimization (_next/image)
      urlPattern: /^\/_next\/image\?.*/i,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "next-image",
        expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 30 },
      },
    },
    {
      // HTML pages — network first, fallback to cache
      urlPattern: /^https:\/\/pm-fuel-relief\.vercel\.app\/.*/i,
      handler: "NetworkFirst",
      options: {
        cacheName: "pages",
        networkTimeoutSeconds: 10,
        expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 7 },
      },
    },
    {
      // Everything else (images, icons, etc.)
      urlPattern: /.*/i,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "others",
        expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 30 },
      },
    },
  ],
})(nextConfig);
