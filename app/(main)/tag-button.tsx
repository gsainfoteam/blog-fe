import Link from "next/link";

export default function TagButton({
  tag,
  currentCategory,
}: {
  tag: string;
  currentCategory: string;
}) {
  return (
    <Link
      className="flex h-[33px] items-center rounded-[10px] bg-[#F1F1F1] px-[8px] py-[14px]"
      href={`/main/${currentCategory}/${tag}`}
    >
      {tag}
    </Link>
  );
}
