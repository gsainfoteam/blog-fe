import Link from "next/link";
import Writing from "../components/Writing/writing";
import { Client } from "@notionhq/client";

const notionKey = "secret_4xikJwE4vtTmD0zpD8vYtT6oTxuyygNRd9eLfdTO6nG";
const notionDatabaseKey = "b066078bdd874b6099d7b0549cb4437d";
const notion = new Client({ auth: notionKey });

export default async function Main() {
  async function getNotionData() {
    try {
      const response = await notion.databases.query({
        database_id: notionDatabaseKey,
      });
      return response.results;
    } catch (err) {
      console.error("Error retrieving data:", err);
      throw new Error("Failed to fetch Notion data."); // 오류를 던져 호출한 곳에서 처리하도록 함
    }
  }
  async function getUserName(userId: string) {
    try {
      const response = await notion.users.retrieve({ user_id: userId });
      return response.name;
    } catch (err) {
      console.error("Error retrieving data:", err);
      throw new Error("Failed to fetch Notion data.");
    }
  }
  async function getBlock(blockId: string) {
    try {
      const response = await notion.blocks.retrieve({ block_id: blockId });
      return response;
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
  const data = await getNotionData();
  const block = await getBlock(data[0].id)
  const blockChildren = await getBlockChildren(data[0].id)
  
  // console.log(blockChildren[0].paragraph.rich_text)

  return data.map((elm) => {
    const title = elm.properties["Name"].title[0].plain_text
    const pageId = elm.id
    const createdTime = elm.created_time
    const createdUserId = elm.created_by.id
  
    return (
      <Link key={pageId} href={`/writing/${pageId}`}>
        <Writing
          title={title}
          content="인포팀에 있어서 가장 중요한 문제는 친해지는건데요 타코 문화가 그걸 해결해줄 수 있을거라고 생각했어요. 타코가 뭐냐면요 칭찬할 일이 있으면 상대에게 타코를 주는건데요, 타코를 많이 모으면 상품을 살 수 있어요. 타코를 통해서 인포팀원끼리 서로 친해지는 것을 기대했어요."
          date={createdTime}
          writer={createdUserId}
        />
      </Link>
    );
  });
}
