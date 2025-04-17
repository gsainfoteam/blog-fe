import { Client } from "@notionhq/client";
import {
  GetUserResponse,
  ListBlockChildrenResponse,
  QueryDatabaseParameters,
  QueryDatabaseResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { GetDatabaseResponse } from "@notionhq/client/build/src/api-endpoints";

const notionKey: string = process.env.NOTION_SECRET_KEY || "NOTION_SECRET_KEY";
const notionDatabaseKey =
  process.env.NOTION_DATABASE_KEY || "NOTION_DATABASE_KEY";
const notion = new Client({ auth: notionKey });

export async function getNotionData(
  category: string,
  tag: string
): Promise<QueryDatabaseResponse> {
  try {
    const mappedCategory =
      {
        tech: "기술",
        culture: "문화",
      }[category] ?? "all";
    const filters = {
      and: [
        ...(category !== "all"
          ? [{ property: "카테고리", select: { equals: mappedCategory } }]
          : []),
        ...(tag !== "Notag"
          ? [{ property: "태그", multi_select: { contains: tag } }]
          : []),
        {
          or: [
            { property: "Status", status: { equals: "Published" } },
            ...(process.env.NODE_ENV === "development"
              ? [
                  { property: "Status", status: { equals: "In Progress" } },
                  { property: "Status", status: { equals: "Pending" } },
                ]
              : []),
          ],
        },
      ],
    } satisfies NonNullable<QueryDatabaseParameters["filter"]>;

    return fetch(
      `https://api.notion.com/v1/databases/${notionDatabaseKey}/query`,
      {
        method: "POST",
        body: JSON.stringify({ filter: filters }),
        headers: {
          Authorization: `Bearer ${notionKey}`,
          "Notion-Version": "2022-06-28",
        },
      }
    ).then((res) => res.json());
  } catch (err) {
    console.error("Error retrieving data:", err);
    throw new Error("Failed to fetch Notion data.");
  }
}

export async function getBlockChildren(
  blockId: string
): Promise<ListBlockChildrenResponse> {
  try {
    return fetch(`https://api.notion.com/v1/blocks/${blockId}/children`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${notionKey}`,
        "Notion-Version": "2022-06-28",
      },
    }).then((res) => res.json());
  } catch (err) {
    console.error("Error retrieving data:", err);
    throw new Error("Failed to fetch Notion data.");
  }
}

export async function getUser(userId: string): Promise<GetUserResponse> {
  try {
    const response = await notion.users.retrieve({ user_id: userId });
    return response;
  } catch (err) {
    console.error("Error retrieving data:", err);
    throw new Error("Fail to load user");
  }
}

type TagProperties = {
  id: string;
  name: string;
  color: string;
  description: string | null;
};

export async function getTags(): Promise<string[]> {
  try {
    const response: GetDatabaseResponse = await notion.databases.retrieve({
      database_id: notionDatabaseKey,
    });
    if (
      response.properties["태그"] &&
      response.properties["태그"].type == "multi_select"
    ) {
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

export async function getNotionPage(pageId: string) {
  try {
    const response = await notion.pages.retrieve({ page_id: pageId });
    return response;
  } catch (err) {
    console.error("Error retrieving page:", err);
    throw new Error("Failed to fetch Notion data.");
  }
}
