import { Client, isFullPage } from "@notionhq/client";
import {
  GetUserResponse,
  ListBlockChildrenResponse,
  PageObjectResponse,
  QueryDataSourceParameters,
} from "@notionhq/client/build/src/api-endpoints";
import { categories, Category } from "./const";

const notionKey: string = process.env.NOTION_SECRET_KEY || "NOTION_SECRET_KEY";
const notionDataSourceId =
  process.env.NOTION_DATA_SOURCE_ID || "NOTION_DATA_SOURCE_ID";
const notion = new Client({ auth: notionKey });

export async function getNotionData(
  category: Category | null,
  tag: string | null,
  cursor?: string
): Promise<PageObjectResponse[]> {
  try {
    const filters = {
      and: [
        ...(category
          ? [{ property: "카테고리", select: { equals: categories[category] } }]
          : []),
        ...(tag !== null
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
    } satisfies NonNullable<QueryDataSourceParameters["filter"]>;

    const response = await notion.dataSources.query({
      data_source_id: notionDataSourceId,
      filter: filters,
      sorts: [
        {
          direction: "descending",
          timestamp: "created_time",
        },
      ],
      start_cursor: cursor,
    });
    return [
      ...response.results.filter(isFullPage),
      ...(response.has_more && response.next_cursor
        ? await getNotionData(category, tag, response.next_cursor)
        : []),
    ];
  } catch (err) {
    console.error("Error retrieving data:", err);
    throw new Error("Failed to fetch Notion data.");
  }
}

export async function getBlockChildren(
  blockId: string
): Promise<ListBlockChildrenResponse> {
  try {
    return notion.blocks.children.list({ block_id: blockId });
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
    const datasource = await notion.dataSources.retrieve({
      data_source_id: notionDataSourceId,
    });
    if (
      datasource.properties["태그"] &&
      datasource.properties["태그"].type == "multi_select"
    ) {
      const tagProperties: TagProperties[] =
        datasource.properties["태그"].multi_select.options;
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
