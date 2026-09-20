// Type declaration for next-pwa (no official @types package)
declare module "next-pwa" {
  import type { NextConfig } from "next";

  interface RuntimeCachingEntry {
    urlPattern: string | RegExp;
    handler:
      | "CacheFirst"
      | "CacheOnly"
      | "NetworkFirst"
      | "NetworkOnly"
      | "StaleWhileRevalidate";
    options?: {
      cacheName?: string;
      expiration?: {
        maxEntries?: number;
        maxAgeSeconds?: number;
      };
      networkTimeoutSeconds?: number;
      fetchOptions?: RequestInit;
      matchOptions?: object;
    };
  }

  interface PWAConfig {
    dest: string;
    register?: boolean;
    skipWaiting?: boolean;
    disable?: boolean;
    buildExcludes?: RegExp[];
    runtimeCaching?: RuntimeCachingEntry[];
    fallbacks?: { document?: string; image?: string; font?: string };
    sw?: string;
    scope?: string;
    customWorkerDir?: string;
  }

  function withPWA(pwaConfig: PWAConfig): (nextConfig: NextConfig) => NextConfig;
  export default withPWA;
}
