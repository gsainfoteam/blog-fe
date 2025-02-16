import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";

import { unified } from "unified";

import parse from "remark-parse";
import stringify from "rehype-stringify";
import toRehype from "remark-rehype";

const notionKey = process.env.NOTION_KEY;
const notion = new Client({ auth: notionKey });
const n2m = new NotionToMarkdown({
  notionClient: notion,
});

n2m.setCustomTransformer("embed", async (block) => {
  const { embed } = block as any;
  if (!embed?.url) return "";
  return `<figure>
  <iframe src="${embed?.url}"></iframe>
  <figcaption>${await n2m.blockToMarkdown(embed?.caption)}</figcaption>
</figure>`;
});

export default async function DetailPage(props) {
  const pageId = props.params.id;
  const mdblocks = await n2m.pageToMarkdown(pageId);
  const mdString = n2m.toMarkdownString(mdblocks);
  const markdown = mdString.parent;

  const html = await unified()
    .use(parse)
    .use(toRehype)
    .use(stringify)
    .process(markdown);
  const htmlString = html.toString();
  return (
    <div>
      <div dangerouslySetInnerHTML={{__html: htmlString}}/>
    </div>
  );
}

