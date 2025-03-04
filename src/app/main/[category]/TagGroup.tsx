import TagButton from "@/app/components/Tag/Tag";

interface TagGroupProps {
  tags: string[];
  params: Promise<{ category: string }>;
}

export default async function TagGroup({ tags, params }: TagGroupProps) {
    const {category} = await params;
    return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, index) => (
        <TagButton key={index} tag={tag} currentCategory={category}/>
      ))}
    </div>
  );
}