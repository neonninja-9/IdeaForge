import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import PWARegistration from "@/components/PWARegistration";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  applicationName: "IdeaForge",
  title: {
    default: "IdeaForge - Project Ideas For Builders",
    template: "%s | IdeaForge",
  },
  description:
    "Discover, structure, and build real-world project ideas with categories, tags, recommendations, voting, and discussion.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "IdeaForge",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-surface flex flex-col min-h-screen`}>
        <PWARegistration />
        <Navbar />
        <div className="flex-1 mt-16 sm:mt-18">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
