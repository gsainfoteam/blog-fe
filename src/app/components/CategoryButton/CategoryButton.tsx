import Link from "next/link";

type CategoryButtonProps = {
  filter: boolean[];
  elm: string;
  index: number;
  handleClick: (idx: number) => void;
};
export default function CategroyButton({
  filter,
  elm,
  index,
  handleClick,
}: CategoryButtonProps) {
  

  
  return (
    <Link href={`/main/${elm}`}>
    <button
      className={`w-[61px] h-[43px] p-[12px] rounded-[24px] text-sm ${
        filter[index] ? "bg-[#FF4500] text-white" : "bg-[#E8E8E8] text-gray-600"
      }`}
      onClick={() => handleClick(index)}
    >
      {elm}
    </button>
    </Link>
  );
}
