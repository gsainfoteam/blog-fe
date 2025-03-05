import TagButton from "@/app/components/Tag/Tag";
import { Client } from "@notionhq/client";
import { GetDatabaseResponse } from "@notionhq/client/build/src/api-endpoints";

const notionKey: string = process.env.NOTION_SECRET_KEY || "NOTION_SECRET_KEY";
const notionDatabaseKey =
  process.env.NOTION_DATABASE_KEY || "NOTION_DATABASE_KEY";
const notion = new Client({ auth: notionKey });

type TagProperties = {
  id: string;
  name: string;
  color: string;
  description: string | null;
};

async function getTags(): Promise<string[]> {
  try {
    const response: GetDatabaseResponse = await notion.databases.retrieve({
      database_id: notionDatabaseKey,
    });
    if (response.properties["태그"].type == "multi_select") {
      const tagProperties: TagProperties[] =
        response.properties["태그"].multi_select.options;
      const tags = tagProperties.map((tag) => {
        return tag.name;
      });
      return tags;
    } else return [];
  } catch (err) {
    console.error("Error retrieving data:", err);
    throw new Error("Failed to fetch Notion data.");
  }
}

interface TagGroupProps {
  category: string;
}

export default async function TagGroup({ category }: TagGroupProps) {
  const tags = await getTags();
  return (
    <div className="flex flex-wrap gap-2 w-[200px]">
      {tags.map((tag, index) => (
        <TagButton key={index} tag={tag} currentCategory={category} />
      ))}
    </div>
  );
}
