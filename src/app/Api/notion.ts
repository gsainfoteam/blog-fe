import { Client } from "@notionhq/client";
import {
  GetUserResponse,
  QueryDatabaseResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { QueryDatabaseParameters } from "@notionhq/client/build/src/api-endpoints";
import { ListBlockChildrenResponseResults } from "notion-to-md/build/types";
import { GetDatabaseResponse } from "@notionhq/client/build/src/api-endpoints";

const notionKey: string = process.env.NOTION_SECRET_KEY || "NOTION_SECRET_KEY";
const notionDatabaseKey =
  process.env.NOTION_DATABASE_KEY || "NOTION_DATABASE_KEY";
const notion = new Client({ auth: notionKey });

export async function getNotionDataWithCache(
  category: string,
  tag: string
): Promise<QueryDatabaseResponse> {
  try {
    const filters = [];
    const categoryForAPI =
      category === "tech" ? "기술" : category === "culture" ? "문화" : "all";
    if (category !== "all") {
      filters.push({
        property: "카테고리",
        select: { equals: categoryForAPI },
      });
    }

    if (tag !== "Notag") {
      filters.push({
        property: "태그",
        multi_select: { contains: tag },
      });
    }

    const query = {
      filter: filters.length
        ? filters.length > 1
          ? { and: filters }
          : filters[0]
        : undefined,
    };

    const response = await fetch(
      `https://api.notion.com/v1/databases/${notionDatabaseKey}/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${notionKey}`,
          "Content-Type": "application/json",
          "Notion-Version": "2022-06-28",
        },
        body: JSON.stringify(query),
        cache: "force-cache",
      }
    );
    return response.json();
  } catch (err) {
    console.error("Error retrieving data:", err);
    throw new Error("Failed to fetch Notion data.");
  }
}

export default async function getNotionData(
  category: string,
  tag: string
): Promise<QueryDatabaseResponse> {
  try {
    const filters = [];
    const categoryForAPI =
      category === "tech" ? "기술" : category === "culture" ? "문화" : "all";
    if (category !== "all") {
      filters.push({
        property: "카테고리",
        select: { equals: categoryForAPI },
      });
    }

    if (tag !== "Notag") {
      filters.push({
        property: "태그",
        multi_select: { contains: tag },
      });
    }

    const query: QueryDatabaseParameters = {
      database_id: notionDatabaseKey,
      filter: filters.length
        ? filters.length > 1
          ? { and: filters }
          : filters[0]
        : undefined,
    };

    const response = await notion.databases.query(query);
    return response;
  } catch (err) {
    console.error("Error retrieving data:", err);
    throw new Error("Failed to fetch Notion data.");
  }
}

export async function getBlockChildren(
  blockId: string
): Promise<ListBlockChildrenResponseResults> {
  try {
    const response = await notion.blocks.children.list({ block_id: blockId });
    return response.results;
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
