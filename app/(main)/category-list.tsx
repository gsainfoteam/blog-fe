"use client";

import { Category } from "@/utils/const";
import { useParams } from "next/navigation";
import CategoryButton from "./category-button";

export default function CategoryList({
  currentCategory,
}: {
  currentCategory: string;
}) {
  const category = [
    { content: "전체", url: "" },
    { content: "기술", url: "tech" },
    { content: "문화", url: "culture" },
  ];
  const currentFilter: boolean[] = [];
  for (const elm of category) {
    if (elm.url === currentCategory) currentFilter.push(true);
    else currentFilter.push(false);
  }
  const { category: current } = useParams<{ category: Category }>();

  return (
    <>
      {category.map((elm, index) => (
        <CategoryButton
          key={index}
          selected={current === elm.url || (!current && elm.url === "")}
          category={elm}
        />
      ))}
    </>
  );
}
