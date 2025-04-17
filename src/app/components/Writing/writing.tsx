import Image from "next/image";
import DefaultImage from "@/app/image/default.svg";
import Link from "next/link";
type WritingProps = {
  title: string;
  content: string;
  date: string;
  writer: string;
  pageId: string;
  imageUrl: string;
};
export default function Writing({
  title,
  content,
  date,
  writer,
  pageId,
  imageUrl,
}: WritingProps) {
  return (
    <Link
      className="w-[620px] h-[180px] pt-[24px] pb-[24px] block my-1"
      href={`/writing/${pageId}/${title}`}
    >
      <div className="flex gap-[36px] justify-between">
        <div className="flex flex-col w-[600px] justify-between">
          <strong>{title}</strong>
          <p>{content}</p>
          <p>
            {date} {writer}
          </p>
        </div>
        <div className="relative w-[130px] h-[90px]">
          <Image
            src={imageUrl === "No PreviewImage" ? DefaultImage : imageUrl}
            sizes="130px"
            alt="Content Image"
            className="rounded-lg object-cover "
            fill
          />
        </div>
      </div>
    </Link>
  );
}
