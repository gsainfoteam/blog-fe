import { getPermanentFileLink, getUser } from "@/utils/notion";
import {
  FilesPropertyItemObjectResponse,
  PageObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";
import ArticleCard from "./article-card";

function isRichTextItemResponse(
  item: RichTextItemResponse[] | Record<string, never>,
): item is RichTextItemResponse[] {
  return (item as RichTextItemResponse[])[0]?.type === "text";
}

function getPlainText(item: RichTextItemResponse[] | Record<string, never>) {
  return isRichTextItemResponse(item) ? item[0].plain_text : undefined;
}

function getFileUrl(
  item: FilesPropertyItemObjectResponse["files"],
  id?: string,
) {
  if (item.length === 0) return undefined;
  const url = "file" in item[0] ? item[0].file.url : item[0].external.url;
  if (!id) return url;
  return getPermanentFileLink(url, id);
}

export const getTitle = (item: PageObjectResponse, encode: boolean = false) => {
  const title =
    item.properties["Name"].type === "title"
      ? isRichTextItemResponse(item.properties["Name"].title)
        ? item.properties["Name"].title[0].plain_text
        : "Unknown title"
      : "Unknown title";

  if (!encode) return title;
  if (process.env.NODE_ENV === "development") return encodeURI(title);
  return title;
};

const getArticle = async (item: PageObjectResponse) => {
  const properties = item.properties;
  if (properties["Summary"].type !== "rich_text")
    throw new Error("Summary is not a rich text");
  const text = getPlainText(properties["Summary"].rich_text);
  if (properties["Featured Image"].type !== "files")
    throw new Error("Featured Image is not a files");
  const imageUrl = getFileUrl(properties["Featured Image"].files, item.id);

  if (properties["Written By"].type !== "people")
    throw new Error("Written By is not a people");
  const userNames = await Promise.all(
    properties["Written By"].people.map((user) =>
      getUser(user.id).then((user) => user.name ?? "Unknown User"),
    ),
  );
  const publishedTime =
    properties["Published Date"].type === "date"
      ? properties["Published Date"].date?.start
      : undefined;

  return {
    id: item.id,
    title: getTitle(item),
    text,
    imageUrl,
    userNames,
    properties,
    createdTime: publishedTime ?? item.created_time.slice(0, 10),
  };
};

export default async function ArticleItem({
  item,
}: {
  item: PageObjectResponse;
}) {
  const content = await getArticle(item);
  return (
    <ArticleCard
      key={content.id}
      title={content.title}
      content={content.text}
      date={content.createdTime}
      writer={content.userNames.join(", ")}
      pageId={content.id}
      imageUrl={content.imageUrl}
    />
  );
}
