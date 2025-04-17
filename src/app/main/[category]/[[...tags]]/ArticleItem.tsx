import { getBlockChildren, getUser } from "@/app/Api/notion";
import Writing from "@/app/components/Writing/writing";
import {
  BlockObjectResponse,
  QueryDatabaseResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";

function isRichTextItemResponse(
  item: RichTextItemResponse[] | Record<string, never>
): item is RichTextItemResponse[] {
  return (item as RichTextItemResponse[])[0].type === "text";
}

const getArticle = async (item: QueryDatabaseResponse["results"][number]) => {
  const blockChildren = (await getBlockChildren(item.id)).results;
  let text =
    "아직 노션에 작성된 글이 없어요. 인포팀 블로그 노션 페이지로 가서 글을 작성해주세요!!";
  let imageUrl = "No PreviewImage";
  let isThereParagraph = false;
  let isTherePicture = false;

  for (const block of blockChildren) {
    if ((block as BlockObjectResponse).type === undefined) break;
    if ("type" in block) {
      if (block.type === "paragraph" && !isThereParagraph) {
        isThereParagraph = true;
        text = block.paragraph.rich_text[0]?.plain_text ?? text;
      }
      if (block.type === "image" && !isTherePicture) {
        isTherePicture = true;
        if (block.image.type === "external") {
          imageUrl = block.image.external.url;
        } else if (block.image.type === "file") {
          imageUrl = block.image.file.url;
        }
      }
      if (isThereParagraph && isTherePicture) break;
    }
  }

  const userName =
    "created_by" in item
      ? await getUser(item.created_by.id).then(
          (user) => user.name ?? "Unknown User"
        )
      : "Unknown User";

  const properties = "properties" in item ? item.properties : {};
  return {
    id: item.id,
    title:
      properties["Name"].type === "title"
        ? isRichTextItemResponse(properties["Name"].title)
          ? properties["Name"].title[0].plain_text
          : "Unknown title"
        : "Unknown title",
    text,
    imageUrl,
    userName,
    properties,
    createdTime:
      "created_time" in item ? item.created_time.slice(0, 10) : "2005-01-18",
  };
};

export default async function ArticleItem({
  item,
}: {
  item: QueryDatabaseResponse["results"][number];
}) {
  const content = await getArticle(item);
  return (
    <Writing
      key={content.id}
      title={content.title}
      content={content.text}
      date={content.createdTime}
      writer={content.userName}
      pageId={content.id}
      imageUrl={content.imageUrl}
    />
  );
}
