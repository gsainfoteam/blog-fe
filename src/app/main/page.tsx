import Writing from "../components/Writing/writing";
import { Client } from "@notionhq/client";

const notionKey = process.env.NOTION_SECRET_KEY;
const notionDatabaseKey = process.env.NOTION_DATABASE_KEY;
const notion = new Client({ auth: notionKey });
async function getNotionData() {
  try {
    const response = await notion.databases.query({
      database_id: notionDatabaseKey,
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
export default async function Main() {
  const data = await getNotionData();
  const scheme_text: string[] = [];
  const preview_image: string[] = [];
  for (let item of data) {
    try {
      const blockChildren = await getBlockChildren(item.id);
      let isThereParagraph = false;
      let isTherePictrue = false;
      for (let i = 0; i < blockChildren.length; i++) {
        if (blockChildren[i].type === "paragraph" && !isThereParagraph) {
          isThereParagraph = true;
          const text = blockChildren[i].paragraph.rich_text[0].plain_text;
          scheme_text.push(text);
        }
        if (blockChildren[i].type === "image" && !isTherePictrue) {
          isTherePictrue = true;
          const pictureUrl = blockChildren[i].image.file.url;
          preview_image.push(pictureUrl);
        }
        if (isThereParagraph && isTherePictrue) break;
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
        imageUrl={preview_image[index]}
      />
    );
  });
}
