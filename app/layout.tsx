import type { Metadata } from "next";
import { Suspense } from "react";
import { Crimson_Text, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { ThemeProvider } from "./providers/ThemeProvider";
import { PostHogProvider, PostHogPageView } from "./providers/PostHogProvider";

const crimsonText = Crimson_Text({
  variable: "--font-crimson",
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "The Mindful AI - A thoughtful exploration of artificial intelligence",
    template: "%s | The Mindful AI",
  },
  description: "Exploring AI, philosophy, and technology with mindfulness. Thoughtful articles on AI infrastructure, ethics, and the future of technology.",
  keywords: ["AI", "Artificial Intelligence", "Philosophy", "Technology", "Mindfulness", "AI Infrastructure", "Ethics", "Machine Learning"],
  authors: [{ name: "The Mindful AI" }],
  creator: "The Mindful AI",
  publisher: "The Mindful AI",
  metadataBase: new URL("https://themindfulai.dev"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://themindfulai.dev",
    title: "The Mindful AI - A thoughtful exploration of artificial intelligence",
    description: "Exploring AI, philosophy, and technology with mindfulness. Thoughtful articles on AI infrastructure, ethics, and the future of technology.",
    siteName: "The Mindful AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Mindful AI - A thoughtful exploration of artificial intelligence",
    description: "Exploring AI, philosophy, and technology with mindfulness. Thoughtful articles on AI infrastructure, ethics, and the future of technology.",
    creator: "@themindfulai",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${crimsonText.variable}`}>
        <PostHogProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
          <Suspense fallback={null}>
            <PostHogPageView />
          </Suspense>
        </PostHogProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
