import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { cx } from "class-variance-authority";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

const APP_NAME = "Chat";
const APP_DESCRIPTION =
  "Chat with different AI agents, for free. No sign-up required. GPT-4 is here 😎.";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: APP_NAME,
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_NAME,
      template: `%s | ${APP_NAME}`,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_NAME,
      template: `%s | ${APP_NAME}`,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: [
    {
      color: "#ffffff",
      media: "(prefers-color-scheme: light)",
    },
    {
      color: "#09090b",
      media: "(prefers-color-scheme: dark)",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cx(
          inter.className,
          "h-dvh fixed top-0 left-0 w-screen overflow-y-none"
        )}
        vaul-drawer-wrapper
      >
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
