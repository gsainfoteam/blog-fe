import mermaid from "mermaid";
import { useEffect } from "react";
import { Code as OriginalCode } from "react-notion-x/build/third-party/code";

export function Code(props: React.ComponentProps<typeof OriginalCode>) {
  const id = props.block.id.replace(/^[0-9]+/, "");
  const language = props.block.properties?.language?.[0]?.[0]?.toLowerCase();
  useEffect(() => {
    if (language !== "mermaid") return;
    const render = async () => {
      try {
        mermaid.initialize({
          startOnLoad: true,
          theme: "dark",
          flowchart: {
            useMaxWidth: false,
            htmlLabels: true,
            curve: "linear",
          },
        });
        await mermaid.run({ querySelector: `#${id} code.language-mermaid` });
      } catch (err) {
        console.error("mermaid highlight error", err);
      }
    };
    render();
  }, [id, language]);

  if (language === "mermaid") {
    return (
      <div id={id}>
        <OriginalCode {...props} />
      </div>
    );
  }
  return <OriginalCode {...props} />;
}
