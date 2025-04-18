import Category from "./Category";
import Banner from "@/app/image/Banner.svg";
import Image from "next/image";
import React from "react";

interface MainLayoutProps {
  children: React.ReactNode;
  params: Promise<{ category: string }>;
}

export default async function MainLayout({
  children,
  params,
}: MainLayoutProps) {
  const { category: category } = await params;
  return (
    <>
      <Image src={Banner} alt="Content Image" width={900} priority />

      <div className="my-[20px]">
        <Category currentCategory={category} />
      </div>

      <div className="flex-col">{children}</div>
    </>
  );
}
