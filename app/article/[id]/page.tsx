import { getTitle } from "@/app/(main)/article-item";
import { getNotionData, getNotionPage } from "@/utils/notion";
import { isFullPage } from "@notionhq/client";
import { notFound, redirect } from "next/navigation";

export default async function Article({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const page = await getNotionPage(id);
  if (!isFullPage(page)) {
    notFound();
  }
  const title = getTitle(page);
  redirect(`/article/${page.id}/${encodeURI(title)}`);
}

export async function generateStaticParams() {
  const data = await getNotionData(null, null);
  const result = data.flatMap((page) => [
    { id: page.id },
    { id: page.id.replace(/-/g, "") },
  ]);
  return result;
}
