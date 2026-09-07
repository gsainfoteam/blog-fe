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
      className="my-1 block h-45 py-6"
      href={`/article/${pageId}/${title}`}
    >
      <div className="flex justify-between gap-9">
        <div className="flex flex-1 flex-col justify-between">
          <strong>{title}</strong>
          <p>{content}</p>
          <p>
            {date} {writer}
          </p>
        </div>
        <div className="relative h-[90px] w-[130px]">
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
