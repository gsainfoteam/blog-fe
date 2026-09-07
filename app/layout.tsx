import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar";
import { GoogleAnalytics } from "@next/third-parties/google";

export const metadata: Metadata = {
  title: "INFOTEAM BLOG",
  metadataBase: "https://blog.gistory.me",
  openGraph: {
    images: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body className="flex flex-col items-center px-4">
        <Navbar />
        <main className="mt-4 max-w-225">{children}</main>
      </body>
      {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID} />
      )}
    </html>
  );
}
