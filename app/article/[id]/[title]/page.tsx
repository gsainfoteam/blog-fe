import Link from "next/link";
import { NotionAPI } from "notion-client";
import NotionWrapper from "./notion-wrapper";
import ShareButton from "./share-button";

const notionAPI = new NotionAPI();

interface DetailPageProps {
  params: Promise<{ id: string; title: string }>;
}
export default async function DetailPage({ params }: DetailPageProps) {
  const { id: pageId } = await params;
  const urlPageId = pageId.replace(/-/g, "");
  const recordMap = await notionAPI.getPage(pageId);
  if (!recordMap) return <div>loading...</div>;
  return (
    <div className="flex flex-col items-center">
      <NotionWrapper recordMap={recordMap} />
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
