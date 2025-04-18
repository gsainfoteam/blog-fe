import { getNotionData } from "@/app/Api/notion";
import TagGroup from "../TagGroup";
import ArticleItem from "./ArticleItem";
import { Suspense } from "react";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

interface CategorizedPageProps {
  params: Promise<{ category: string; tags: string[] | undefined }>;
}

export const revalidate = 3600;

export default async function CategorizedPage({
  params,
}: CategorizedPageProps) {
  const { category } = await params;
  const { tags } = await params;
  const response = await getNotionData(
    category,
    tags === undefined ? "Notag" : tags[0]
  );

  return (
    <div className="flex items-start justify-between">
      <div className="flex flex-col">
        {response.results.map((item) => (
          <Suspense key={item.id}>
            <ArticleItem item={item as PageObjectResponse} />
          </Suspense>
        ))}
      </div>
      <TagGroup category={category} />
    </div>
  );
}
