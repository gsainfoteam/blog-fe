import { getNotionData } from "@/app/Api/notion";
import TagGroup from "../TagGroup";
import ArticleItem from "./ArticleItem";
import { Suspense } from "react";

interface CategorizedPageProps {
  params: Promise<{ category: string; tags: string[] | undefined }>;
}

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
          <Suspense key={item.id} fallback={<div>Loading...</div>}>
            <ArticleItem item={item} />
          </Suspense>
        ))}
      </div>
      <TagGroup category={category} />
    </div>
  );
}
