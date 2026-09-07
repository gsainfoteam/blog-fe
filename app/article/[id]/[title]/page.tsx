import { getTitle } from "@/app/(main)/article-item";
import {
  getNotionData,
  getPermanentFileLink,
  getProperties,
  getUser,
} from "@/utils/notion";
import { Metadata, ResolvedMetadata } from "next";
import Link from "next/link";
import { NotionAPI } from "notion-client";
import { getBlockValue } from "notion-utils";
import { cache } from "react";
import NotionWrapper from "./notion-wrapper";
import ShareButton from "./share-button";

const notionAPI = new NotionAPI();

const getPage = cache(async (id: string) => {
  return notionAPI.getPage(id);
});

type Props = {
  params: Promise<{ id: string; title: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: Promise<ResolvedMetadata>,
): Promise<Metadata> {
  const parentMetadata = await parent;
  const { id: pageId, title: originalTitle } = await params;
  const title = decodeURIComponent(originalTitle);
  const recordMap = await getPage(pageId);
  const page = getBlockValue(
    Object.values(recordMap.block).find(
      (b) => getBlockValue(b.value)?.type === "page",
    )!,
  )!;
  const properties = await getProperties();
  const thumbnail =
    page.properties[
      decodeURIComponent(properties["Featured Image"].id)
    ]?.[0][1][0][1];
  const description =
    page.properties[decodeURIComponent(properties["Summary"].id)]?.[0][0];
  const writtenByIds: string[] =
    page.properties[decodeURIComponent(properties["Written By"].id)]
      ?.filter((item: unknown[]) => item?.length === 2)
      .map((item: string[][][]) => item?.[1]?.[0]?.[1]) ?? [];
  const writtenBy = await Promise.all(
    writtenByIds.map((id) =>
      getUser(id).then((user) => user.name ?? "Unknown User"),
    ),
  );
  const tags: string[] =
    page.properties[decodeURIComponent(properties["태그"].id)]?.[0][0].split(
      ",",
    ) ?? [];
  const publishedDate =
    page.properties[
      decodeURIComponent(properties["Published Date"].id)
    ]?.[0][1][0][1].start_date;

  return {
    title,
    description,
    authors: writtenBy.map((name) => ({ name })),
    openGraph: {
      publishedTime: publishedDate,
      tags,
      authors: writtenBy,
      title: title,
      type: "article",
      images: thumbnail
        ? getPermanentFileLink(thumbnail, pageId)
        : parentMetadata.openGraph?.images,
      description,
    },
  };
}

export default async function DetailPage({ params }: Props) {
  const { id: pageId, title } = await params;
  const recordMap = await getPage(pageId);
  const page = getBlockValue(
    Object.values(recordMap.block).find(
      (b) => getBlockValue(b.value)?.type === "page",
    )!,
  )!;
  const properties = await getProperties();
  const writtenByIds: string[] =
    page.properties[decodeURIComponent(properties["Written By"].id)]
      ?.filter((item: unknown[]) => item?.length === 2)
      .map((item: string[][][]) => item?.[1]?.[0]?.[1]) ?? [];
  const writtenBy = await Promise.all(
    writtenByIds.map((id) =>
      getUser(id).then((user) => user.name ?? "Unknown User"),
    ),
  );
  const tags: string[] =
    page.properties[decodeURIComponent(properties["태그"].id)]?.[0][0].split(
      ",",
    ) ?? [];
  const publishedDate =
    page.properties[
      decodeURIComponent(properties["Published Date"].id)
    ]?.[0][1][0][1].start_date;

  return (
    <div className="mb-32 flex flex-col items-center">
      <div className="w-dvw max-w-(--notion-max-width) px-4 pb-10">
        <h1 className="mb-5 text-4xl font-bold">{decodeURIComponent(title)}</h1>
        <div className="mb-4 flex flex-col gap-2">
          <div className="flex flex-col">
            <div>작성: {writtenBy.join(", ")}</div>
            <div>작성일: {publishedDate}</div>
          </div>
          <div className="flex gap-2">
            {tags.map((tag) => (
              <div
                key={tag}
                className="flex gap-2 rounded-full bg-[#FF4500] px-2 py-1 text-sm text-white"
              >
                #{tag}
              </div>
            ))}
          </div>
        </div>
        <NotionWrapper recordMap={recordMap} />
      </div>
      <ShareButton url={`https://blog.gistory.me/article/${pageId}/${title}`} />
      <div className="mt-4 flex flex-col items-center gap-2">
        <h4>인포팀에서 함께 일하고 싶다면?</h4>

        <Link
          href="/"
          className="rounded-[5px] border-2 border-[#FF4500] px-3 py-2 text-sm text-[#FF4500]"
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
    title: getTitle(page, true),
  }));
  return result;
}
