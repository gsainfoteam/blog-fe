import Link from "next/link";
import { NotionAPI } from "notion-client";
import NotionWrapper from "./notion-wrapper";
import ShareButton from "./share-button";
import { getNotionData, getProperties } from "@/utils/notion";
import { getTitle } from "@/app/(main)/article-item";
import { Metadata } from "next";
import { cache } from "react";

const getPage = cache(async (id: string) => {
  const notionAPI = new NotionAPI();
  return notionAPI.getPage(id);
});

type Props = {
  params: Promise<{ id: string; title: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id: pageId, title: originalTitle } = await params;
  const title = decodeURIComponent(originalTitle);
  const recordMap = await getPage(pageId);
  const page = Object.values(recordMap.block).find(
    (b) => b.value.type === "page"
  )!;
  const properties = await getProperties();
  const thumbnail =
    page.value.properties[
      decodeURIComponent(properties["Featured Image"].id)
    ]?.[0][0];
  const description =
    page.value.properties[decodeURIComponent(properties["Summary"].id)]?.[0][0];

  return {
    title,
    description,
    openGraph: {
      title: title,
      type: "article",
      images: thumbnail,
      description,
    },
  };
}

export default async function DetailPage({ params }: Props) {
  const { id: pageId, title } = await params;
  const recordMap = await getPage(pageId);
  return (
    <div className="flex flex-col items-center mb-32">
      <NotionWrapper recordMap={recordMap} />
      <div className="flex flex-col items-end mb-8">
        <ShareButton
          url={`https://blog.gistory.me/article/${pageId}/${title}`}
        />
      </div>
      <div className="flex flex-col items-center gap-2">
        <h4>인포팀에서 함께 일하고 싶다면?</h4>

        <Link
          href="/"
          className="text-sm px-[12px] py-[8px] rounded-[5px] border-2 border-[#FF4500] text-[#FF4500]"
        >
          지원 바로가기
        </Link>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const data = await getNotionData(null, null);
  const result = data.map((page) => ({
    id: page.id,
    title:
      process.env.NODE_ENV === "development"
        ? encodeURI(getTitle(page))
        : getTitle(page),
  }));
  return result;
}
