import Link from "next/link";

export default function Navbar() {
  return (
    <div className="flex items-center justify-between fixed top-0 left-0 right-0 h-[55px] px-[24px] bg-white">
      <Link href={`/main`}><strong className="text-[#FF4500]">Infoteam Blog</strong></Link>
      <div className="flex gap-[16px]">
        <span className="px-[12px] py-[8px]">소개</span>
        <Link
          href="https://www.notion.so/infoteam-rulrudino/185365ea27df802683e0c7374f964784"
          className="text-sm px-[12px] py-[8px] rounded-[5px] border-2 border-[#FF4500] text-[#FF4500]"
        >
          지원 바로가기
        </Link>
      </div>
    </div>
  );
}
