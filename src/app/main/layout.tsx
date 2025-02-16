import Category from "./CategoryButton";
import Banner from "@/app/image/Banner.svg";
import Image from "next/image";
import React from "react";
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Image src={Banner} alt="Content Image" width={900} />

      <div className="my-[20px]">
        <Category />
      </div>

      <div className="flex-col">{children}</div>
    </>
  );
}
