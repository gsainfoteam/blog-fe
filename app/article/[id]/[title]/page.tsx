import Link from "next/link";
import { NotionAPI } from "notion-client";
import NotionWrapper from "./notion-wrapper";
import ShareButton from "./share-button";
import { getNotionData } from "@/utils/notion";
import { getTitle } from "@/app/(main)/article-item";

const notionAPI = new NotionAPI();

interface DetailPageProps {
  params: Promise<{ id: string; title: string }>;
}
export default async function DetailPage({ params }: DetailPageProps) {
  const { id: pageId } = await params;
  const urlPageId = pageId.replace(/-/g, "");
  const recordMap = await notionAPI.getPage(pageId);
  return (
    <div className="flex flex-col items-center">
      <NotionWrapper recordMap={recordMap} />
      <div className="flex flex-col items-end my-[50px]">
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

export async function generateStaticParams() {
  const data = await getNotionData(null, null);
  const result = data.flatMap((page) => [
    {
      id: page.id,
      title: encodeURI(getTitle(page)),
    },
    {
      id: page.id,
      title: getTitle(page),
    },
  ]);
  return result;
}
