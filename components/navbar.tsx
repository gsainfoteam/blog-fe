import Link from "next/link";

export default function Navbar() {
  return (
    <div className="sticky top-0 z-10 flex h-[55px] w-dvw items-center justify-between bg-white px-6">
      <Link href="/">
        <strong className="text-[#FF4500]">Infoteam Blog</strong>
      </Link>
      <div className="flex gap-4">
        <Link
          href="https://introduce.gistory.me/"
          target="_blank"
          rel="noopener"
          className="px-3 py-2"
        >
          소개
        </Link>
        <Link
          href="https://www.notion.so/infoteam-rulrudino/185365ea27df802683e0c7374f964784"
          target="_blank"
          rel="noopener"
          className="rounded-[5px] border-2 border-[#FF4500] px-3 py-2 text-sm text-[#FF4500]"
        >
          지원 바로가기
        </Link>
      </div>
    </div>
  );
}
