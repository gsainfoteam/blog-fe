"use client";

import { useState } from "react";
import CategroyButton from "../../components/CategoryButton/CategoryButton";

export default function Category({
  currentCategory,
}: {
  currentCategory: string;
}) {
  const category = ["all", "tech", "culture"];
  const currentFilter: boolean[] = [];
  for (const elm of category) {
    if (elm === currentCategory) currentFilter.push(true);
    else currentFilter.push(false);
  }
  const [filter, setFilter] = useState<boolean[]>(currentFilter);

  const handleClick = (idx: number) => {
    const newArr = Array(category.length).fill(false);
    newArr[idx] = true;
    setFilter(newArr);
  };
  return (
    <>
      {category.map((elm, index) => (
        <CategroyButton
          key={index}
          filter={filter}
          elm={elm}
          index={index}
          handleClick={handleClick}
        />
      ))}
    </>
  );
}
