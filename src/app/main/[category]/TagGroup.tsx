import TagButton from "@/app/components/Tag/Tag";

interface TagGroupProps {
  tags: string[];
  category: string;
}

export default async function TagGroup({ tags, category }: TagGroupProps) {
  return (
    <div className="flex flex-wrap gap-2 w-[200px]">
      {tags.map((tag, index) => (
        <TagButton key={index} tag={tag} currentCategory={category} />
      ))}
    </div>
  );
}
