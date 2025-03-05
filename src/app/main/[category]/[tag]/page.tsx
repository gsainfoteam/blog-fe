export default async function Page({
  params,
}: {
  params: Promise<{ category: string; tag: string }>;
}) {
  const { category, tag } = await params;
  return (
    <div>
      <h1>{category}</h1>
      <h1>{tag}</h1>
    </div>
  );
}
