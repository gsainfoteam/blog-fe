import TagButton from "./tag-button";
// import { getTags } from "@/app/Api/notion";

interface TagGroupProps {
  category: string;
}

export default async function TagGroup({ category }: TagGroupProps) {
  // const tags = await getTags();
  return (
    <div className="flex flex-wrap gap-2 w-[200px] sticky top-20">
      {/* {tags.map((tag, index) => (
        <TagButton key={index} tag={tag} currentCategory={category} />
      ))} */}
    </div>
  );
}
