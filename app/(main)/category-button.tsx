import Link from "next/link";

type Category = {
  content: string;
  url: string;
};

type CategoryButtonProps = {
  selected: boolean;
  category: Category;
};
export default function CategoryButton({
  selected,
  category,
}: CategoryButtonProps) {
  return (
    <Link href={`/${category.url}`} className="mr-[15px]">
      <button
        className={`h-[43px] w-[61px] cursor-pointer rounded-[24px] p-[12px] text-sm ${
          selected ? "bg-[#FF4500] text-white" : "bg-[#E8E8E8] text-gray-600"
        }`}
      >
        {category.content}
      </button>
    </Link>
  );
}
