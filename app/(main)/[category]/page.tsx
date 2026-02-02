// import { getNotionData } from "@/app/Api/notion";
import { getNotionData } from "@/utils/notion";
import CategoryList from "../category-list";
// import TagGroup from "../tag-group";
import { categories, Category } from "@/utils/const";
import { Suspense } from "react";
import ArticleItem from "../article-item";

export default async function CategorizedPage({
  params,
}: {
  params: Promise<{ category: string; tags: string[] | undefined }>;
}) {
  const { category, tags } = await params;
  const response = await getNotionData(
    category as Category,
    tags === undefined ? null : tags[0]
  );

  return (
    <>
      <div className="my-[20px]">
        <CategoryList currentCategory={category} />
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
