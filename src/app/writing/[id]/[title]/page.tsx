import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";

import { unified } from "unified";
import parse from "remark-parse";
import stringify from "rehype-stringify";
import toRehype from "remark-rehype";

import Link from "next/link";
import ShareButton from "@/app/components/ShareButton/ShareButton";
const notionKey = process.env.NOTION_SECRET_KEY;
const notion = new Client({ auth: notionKey });
const n2m = new NotionToMarkdown({
  notionClient: notion,
});

n2m.setCustomTransformer("embed", async (block) => {
  const { embed } = block as any;
  if (!embed?.url) return "";
  return `<figure style="margin: 20px;">
  <iframe src="${embed?.url}"></iframe>
  <figcaption>${await n2m.blockToMarkdown(embed?.caption)}</figcaption>
</figure>`;
});

export default async function DetailPage(props) {
  const pageId = props.params.id;
  const pageTitleIncode = props.params.title;
  const pageTitle = decodeURIComponent(pageTitleIncode);
  const mdblocks = await n2m.pageToMarkdown(pageId);
  const mdString = n2m.toMarkdownString(mdblocks);
  const markdown = mdString.parent;
  const urlPageId = pageId.replace(/-/g, "");

  const html = await unified()
    .use(parse)
    .use(toRehype)
    .use(stringify)
    .process(markdown);
  const htmlString = html.toString();
  return (
    <div className="flex flex-col items-center">
      <h1>{pageTitle}</h1>
      <div dangerouslySetInnerHTML={{ __html: htmlString }} />
      <div className="flex flex-col items-end w-[900px] my-[50px]">
        <ShareButton
          url={`https://www.notion.so/infoteam-rulrudino/${urlPageId}`}
        />
      </div>
      <h4>인포팀에서 함께 일하고 싶다면?</h4>

      <Link
        href="/"
        className="text-sm px-[12px] py-[8px] rounded-[5px] border-2 border-[#FF4500] text-[#FF4500]"
      >
        지원 바로가기
      </Link>
    </div>
  );
}
