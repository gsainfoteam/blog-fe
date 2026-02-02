// import { getNotionData } from "@/app/Api/notion";
import Category from "./category";
import TagGroup from "./tag-group";
// import ArticleItem from "./ArticleItem";
// import { Suspense } from "react";
// import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export default async function CategorizedPage({
  params,
}: {
  params: Promise<{ category: string; tags: string[] | undefined }>;
}) {
  const { category, tags } = await params;
  // const response = await getNotionData(
  //   category,
  //   tags === undefined ? "Notag" : tags[0]
  // );

  return (
    <>
      <div className="my-[20px]">
        <Category currentCategory={category} />
      </div>

      <div className="flex-col">
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            {/* {response.results.map((item) => (
          <Suspense key={item.id}>
            <ArticleItem item={item as PageObjectResponse} />
          </Suspense>
        ))} */}
          </div>
          <TagGroup category={category} />
        </div>
      </div>
    </>
  );
}
