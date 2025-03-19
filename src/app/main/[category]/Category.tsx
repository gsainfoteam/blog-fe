"use client";

import { useState } from "react";
import CategroyButton from "../../components/CategoryButton/CategoryButton";

type Category = {
  content: string;
  url: string;
};

export default function Category({
  currentCategory,
}: {
  currentCategory: string;
}) {
  const category: Category[] = [
    { content: "전체", url: "all" },
    { content: "기술", url: "tech" },
    { content: "문화", url: "culture" },
  ];
  const currentFilter: boolean[] = [];
  for (const elm of category) {
    if (elm.url === currentCategory) currentFilter.push(true);
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
          category={elm}
          index={index}
          handleClick={handleClick}
        />
      ))}
    </>
  );
}
