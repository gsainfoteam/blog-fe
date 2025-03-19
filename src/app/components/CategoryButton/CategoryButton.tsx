import Link from "next/link";

type Category = {
  content: string;
  url: string;
}

type CategoryButtonProps = {
  filter: boolean[];
  category: Category;
  index: number;
  handleClick: (idx: number) => void;
};
export default function CategroyButton({
  filter,
  category,
  index,
  handleClick,
}: CategoryButtonProps) {
  

  
  return (
    <Link href={`/main/${category.url}`} className="mr-[15px]">
    <button
      className={`w-[61px] h-[43px] p-[12px] rounded-[24px] text-sm ${
        filter[index] ? "bg-[#FF4500] text-white" : "bg-[#E8E8E8] text-gray-600"
      }`}
      onClick={() => handleClick(index)}
    >
      {category.content}
    </button>
    </Link>
  );
}
