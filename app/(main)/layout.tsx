import Banner from "@/assets/banner.svg";
import Image from "next/image";
import React from "react";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Image src={Banner} alt="Content Image" className="w-[900px]" priority />

      {children}
    </>
  );
}
