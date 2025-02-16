import Writing from "@/app/components/Writing/writing";
import { Client } from "@notionhq/client";

const notionKey = "secret_4xikJwE4vtTmD0zpD8vYtT6oTxuyygNRd9eLfdTO6nG";
const notionDatabaseKey = "b066078bdd874b6099d7b0549cb4437d";
const notion = new Client({ auth: notionKey });

async function getNotionData(category) {
  try {
    const response = await notion.databases.query({
      database_id: notionDatabaseKey,
      filter: {
        property: "카테고리",
        select: {
          equals: category,
        },
      },
    });
    return response.results;
  } catch (err) {
    console.error("Error retrieving data:", err);
    throw new Error("Failed to fetch Notion data.");
  }
}
async function getBlockChildren(blockId: string) {
  try {
    const response = await notion.blocks.children.list({ block_id: blockId });
    return response.results;
  } catch (err) {
    console.error("Error retrieving data:", err);
    throw new Error("Failed to fetch Notion data.");
  }
}

export default async function CategorizedPage({ params }) {
  const category = decodeURIComponent(params.category);
  const data = await getNotionData(category);
  const scheme_text: string[] = [];
  for (let item of data) {
    try {
      const blockChildren = await getBlockChildren(item.id);
      let isThereParagraph = false;
      for (let i = 0; i < blockChildren.length; i++) {
        if (blockChildren[i].type === "paragraph") {
          isThereParagraph = true;
          const text = blockChildren[i].paragraph.rich_text[0].plain_text;
          scheme_text.push(text);
          break;
        }
      }
      if (!isThereParagraph)
        scheme_text.push(
          "아직 노션에 작성된 글이 없어요. 인포팀 블로그 노션 페이지로 가서 글을 작성해주세요!!"
        );
    } catch (err) {
      console.log(err);
    }
  }
  return data.map((elm, index) => {
    const title = elm.properties["Name"].title[0].plain_text;
    const pageId = elm.id;
    const createdTime = elm.created_time;
    const createdUserId = elm.created_by.id;
    const createdTimeSliced = createdTime.slice(0, 10);
    return (
      <Writing
        key={pageId}
        title={title}
        content={scheme_text[index]}
        date={createdTimeSliced}
        writer={createdUserId}
        pageId={pageId}
      />
    );
  });
}
