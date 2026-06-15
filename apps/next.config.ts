import type { NextConfig } from "next";
import { createMDX } from "fumadocs-mdx/next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");
const isDocsDev = process.env.DOCS_DEV === "true";
const isProduction = process.env.NODE_ENV === "production";
const isStaticWebBuild = process.env.BUILD_WEB_STATIC === "true";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["skygenesisenterprise.com", "192.168.1.3"],
  outputFileTracingExcludes: {
    "*": ["test/**"],
  },

  reactStrictMode: true,
  poweredByHeader: false,

  ...(isStaticWebBuild
    ? {
        output: "export",
        images: {
          unoptimized: true,
          remotePatterns: [
            { protocol: "https", hostname: "skygenesisenterprise.com", pathname: "/**" },
            { protocol: "https", hostname: "api.dicebear.com", pathname: "/**" },
            { protocol: "https", hostname: "avatars.githubusercontent.com", pathname: "/**" },
            { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
            { protocol: "http", hostname: "127.0.0.1", pathname: "/**" },
            { protocol: "http", hostname: "localhost", pathname: "/**" },
          ],
        },
      }
    : {
        ...(isProduction && {
          output: "standalone",
          ...(process.env.ASSET_PREFIX && { assetPrefix: process.env.ASSET_PREFIX }),
        }),
      }),

  basePath: process.env.BASE_PATH || "",

  ...(!isStaticWebBuild && {
    images: {
      remotePatterns: [
        { protocol: "https", hostname: "skygenesisenterprise.com", pathname: "/**" },
        { protocol: "https", hostname: "api.dicebear.com", pathname: "/**" },
        { protocol: "https", hostname: "avatars.githubusercontent.com", pathname: "/**" },
        { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
        { protocol: "http", hostname: "127.0.0.1", pathname: "/**" },
        { protocol: "http", hostname: "localhost", pathname: "/**" },
      ],
    },
  }),

  ...(!isStaticWebBuild && {
    async headers() {
      const headers = [{ key: "Referrer-Policy", value: "origin-when-cross-origin" }];

      if (isProduction) {
        headers.push(
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" }
        );
      }

      return [{ source: "/(.*)", headers }];
    },

    async rewrites() {
      return [
        {
          source: "/api/:path*",
          destination: "http://localhost:8080/api/:path*",
        },
      ];
    },
  }),
};

let configWithPlugins: NextConfig = nextConfig;
if (isDocsDev) {
  configWithPlugins = createMDX()(nextConfig);
}

export default withNextIntl(configWithPlugins);
