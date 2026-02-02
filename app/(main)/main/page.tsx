import { getNotionData } from "@/utils/notion";
import CategoryList from "../category-list";
// import TagGroup from "../tag-group";
import { categories } from "@/utils/const";
import { Suspense } from "react";
import ArticleItem from "../article-item";

export default async function MainPage() {
  const response = await getNotionData(null, null);

  return (
    <>
      <div className="my-[20px]">
        <CategoryList currentCategory={"all"} />
      </div>

      <div className="flex gap-4">
        <div className="flex flex-col">
          {response.map((item) => (
            <Suspense key={item.id}>
              <ArticleItem item={item} />
            </Suspense>
          ))}
        </div>
        {/* <div>
          <TagGroup category={category} />
        </div> */}
      </div>
    </>
  );
}

export function generateStaticParams() {
  return Object.keys(categories).map((category) => ({ category }));
}
