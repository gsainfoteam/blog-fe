"use client";

import { useState } from "react";
import CategroyButton from "../components/CategoryButton/CategoryButton";
import Banner from "@/app/image/Banner.svg";
import Image from "next/image";
export default function MainLayout({ children }) {
  const [filter, setFilter] = useState<boolean[]>([true, false, false]);
  const category = ["전체", "기술", "문화"];
  const handleClick = (idx: number) => {
    const newArr = Array(category.length).fill(false);
    newArr[idx] = true;
    setFilter(newArr);
  };
  return (
    <>
      <Image src={Banner} alt="Content Image" width={900} />
      <div className="my-[20px]">
        {category.map((elm, index) => {
          return (
            <CategroyButton
              key={index}
              filter={filter}
              elm={elm}
              index={index}
              handleClick={handleClick}
            />
          );
        })}
      </div>

      <div className="flex-col">{children}</div>
    </>
  );
}
