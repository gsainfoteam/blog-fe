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

export default async function getNotionData(
  category: string,
  tag: string
): Promise<QueryDatabaseResponse> {
  console.log(category, tag);
  try {
    let query: QueryDatabaseParameters;
    if (category !== "전체") {
      query = {
        database_id: notionDatabaseKey,
        filter: {
          property: "카테고리",
          select: {
            equals: category,
          },
        },
      };
    } else if (category !== "전체" && tag !== "Notag") {
      query = {
        database_id: notionDatabaseKey,
        filter: {
          and: [
            {
              property: "카테고리",
              select: {
                equals: category,
              },
            },
            {
              property: "태그",
              multi_select: {
                contains: tag,
              },
            },
          ],
        },
      };
    } else if (category === "전체" && tag !== "Notag") {
      query = {
        database_id: notionDatabaseKey,
        filter: {
          property: "태그",
          multi_select: {
            contains: tag,
          },
        },
      };
    } else {
      query = {
        database_id: notionDatabaseKey,
      };
    }

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
