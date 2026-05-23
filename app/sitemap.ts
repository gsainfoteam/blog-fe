import { getNotionData } from "@/utils/notion";
import type { MetadataRoute } from "next";
import { getTitle } from "./(main)/article-item";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await getNotionData(null, null);
  const result = data.map((page) => ({
    id: page.id,
    title: getTitle(page, true),
    lastModified: page.last_edited_time,
  }));
  return [
    {
      url: "https://blog.gistory.me",
      lastModified: new Date(),
      changeFrequency: "weekly",
    },
    ...result.map(
      (page) =>
        ({
          url: `https://blog.gistory.me/article/${page.id}/${page.title}`,
          lastModified: page.lastModified,
          changeFrequency: "weekly",
        }) as const,
    ),
  ];
}
