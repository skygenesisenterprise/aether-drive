import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Providers } from "@/context/Providers";
import "@/styles/globals.css";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: {
    template: "%s",
    default: "Sky Genesis Enterprise",
  },
  description:
    "The Official Sky Genesis Enterprise website. Learn about our products, services, and how we can help your business thrive in the digital age.",
  icons: {
    icon: [
      {
        url: "/enterprise-favicon.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/enterprise-favicon.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/enterprise-favicon.png",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html data-scroll-behavior="smooth" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${fontSans.variable} ${fontMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
