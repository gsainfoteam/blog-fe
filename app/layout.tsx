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
      <body className="flex flex-col items-center py-[100px]">
        <Navbar />
        <main className="w-[900px]">{children}</main>
      </body>
    </html>
  );
}
