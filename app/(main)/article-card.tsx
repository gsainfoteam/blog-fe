import Image from "next/image";
import DefaultImage from "@/assets/default.svg";
import Link from "next/link";

type WritingProps = {
  title: string;
  content?: string;
  date: string;
  writer: string;
  pageId: string;
  imageUrl?: string;
};

export default function ArticleCard({
  title,
  content,
  date,
  writer,
  pageId,
  imageUrl,
}: WritingProps) {
  return (
    <Link
      className="h-[180px] pt-[24px] pb-[24px] block my-1"
      href={`/article/${pageId}/${title}`}
    >
      <div className="flex gap-[36px] justify-between">
        <div className="flex flex-col justify-between flex-1">
          <strong>{title}</strong>
          <p>{content}</p>
          <p>
            {date} {writer}
          </p>
        </div>
        <div className="relative w-[130px] h-[90px]">
          <Image
            src={imageUrl ?? DefaultImage}
            sizes="130px"
            alt="Content Image"
            className="rounded-lg object-contain"
            fill
          />
        </div>
      </div>
    </Link>
  );
}
