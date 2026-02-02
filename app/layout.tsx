import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar";

export const metadata: Metadata = {
  title: "INFOTEAM BLOG",
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
        <main className="max-w-[900px] mt-4">{children}</main>
      </body>
    </html>
  );
}
