import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { cx } from "class-variance-authority";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chat",
  description:
    "Chat with different AI agents, for free. No sign-up required. GPT-4 is here 😎.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cx(
          inter.className,
          "h-dvh fixed top-0 left-0 w-screen overflow-y-none"
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
