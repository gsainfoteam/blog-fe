import Link from "next/link";

export default function TagButton({ tag, url }: { tag: string; url: string }) {
  return (
    <Link
      className="flex items-center bg-[#F1F1F1] rounded-[10px] h-[33px] px-[8px] py-[14px]"
      href={`${url}/${tag}`}
    >
      {tag}
    </Link>
  );
}
