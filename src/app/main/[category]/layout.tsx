import Category from "./Category";
import Banner from "@/app/image/Banner.svg";
import Image from "next/image";
import React from "react";

interface MainLayoutProps {
  children: React.ReactNode;
  params: {
    category: string;
  };
}

export default function MainLayout({ children, params }: MainLayoutProps) {
  const currentCategory = decodeURIComponent(params.category);
  return (
    <>
      <Image src={Banner} alt="Content Image" width={900} />

      <div className="my-[20px]">
        <Category currentCategory={currentCategory} />
      </div>

      <div className="flex-col">{children}</div>
    </>
  );
}
