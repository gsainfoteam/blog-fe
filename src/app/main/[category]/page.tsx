import Writing from "@/app/components/Writing/writing";
import { Client } from "@notionhq/client";
import {
  BlockObjectResponse,
  EmptyObject,
  GetUserResponse,
  QueryDatabaseResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { QueryDatabaseParameters } from "@notionhq/client/build/src/api-endpoints";
import { ListBlockChildrenResponseResults } from "notion-to-md/build/types";

const notionKey: string = process.env.NOTION_SECRET_KEY || "NOTION_SECRET_KEY";
const notionDatabaseKey =
  process.env.NOTION_DATABASE_KEY || "NOTION_DATABASE_KEY";
const notion = new Client({ auth: notionKey });

function isRichTextItemResponse(
  item: RichTextItemResponse[] | EmptyObject
): item is RichTextItemResponse[] {
  return (item as RichTextItemResponse[])[0].type === "text";
}

async function getNotionData(category: string): Promise<QueryDatabaseResponse> {
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
async function getBlockChildren(
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
async function getUser(userId: string): Promise<GetUserResponse> {
  try {
    const response = await notion.users.retrieve({ user_id: userId });
    return response;
  } catch (err) {
    console.error("Error retrieving data:", err);
    throw new Error("Fail to load user");
  }
}

interface CategorizedPageProps {
  params: Promise<{ category: string }>;
}

export default async function CategorizedPage({
  params,
}: CategorizedPageProps) {
  let { category } = await params;
  category = decodeURIComponent(category);
  const response = await getNotionData(category);
  const data = response.results;
  const scheme_text: string[] = [];
  const preview_image: string[] = [];
  const user_names: string[] = [];

  for (const item of data) {
    try {
      const blockChildren = await getBlockChildren(item.id);
      let isThereParagraph = false;
      let isTherePictrue = false;

      for (let i = 0; i < blockChildren.length; i++) {
        const block = blockChildren[i];
        if ((block as BlockObjectResponse).type === undefined) break;
        if ("type" in block) {
          if (block.type === "paragraph" && !isThereParagraph) {
            isThereParagraph = true;
            const text = block.paragraph.rich_text[0].plain_text;
            scheme_text.push(text);
          }
          if (block.type === "image" && !isTherePictrue) {
            isTherePictrue = true;
            let pictureUrl;
            if (block.image.type === "external")
              pictureUrl = block.image.external.url;
            else if (block.image.type === "file")
              pictureUrl = block.image.file.url;
            else pictureUrl = "No PreviewImage";
            preview_image.push(pictureUrl);
          }
          if (isThereParagraph && isTherePictrue) break;
        }
      }
      if (!isThereParagraph)
        scheme_text.push(
          "아직 노션에 작성된 글이 없어요. 인포팀 블로그 노션 페이지로 가서 글을 작성해주세요!!"
        );
      if (!isTherePictrue) preview_image.push("No PreviewImage");
    } catch (err) {
      console.log(err);
    }
  }
  for (const item of data) {
    if ("created_by" in item) {
      const userId = item.created_by.id;
      const userInfo = await getUser(userId);
      if (userInfo.name) user_names.push(userInfo.name);
      else user_names.push("Unknown User");
    } else user_names.push("Unknown User");
  }

  return data.map((elm, index) => {
    let title;
    let createdTime;
    if ("properties" in elm && elm.properties["Name"].type === "title") {
      const RichTextitme = elm.properties["Name"].title;
      if (isRichTextItemResponse(RichTextitme)) {
        title = RichTextitme[0].plain_text;
      } else {
        title = "Unknwon title";
      }
    } else {
      title = "Unknown title";
    }
    if ("created_time" in elm) {
      createdTime = elm.created_time;
    } else {
      createdTime = "2005-01-18";
    }
    const pageId = elm.id;
    const createdUserId = user_names[index];
    const createdTimeSliced = createdTime.slice(0, 10);
    return (
      <Writing
        key={pageId}
        title={title}
        content={scheme_text[index]}
        date={createdTimeSliced}
        writer={createdUserId}
        pageId={pageId}
        imageUrl={preview_image[index]}
      />
    );
  });
}
