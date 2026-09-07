"use client";
import { ExtendedRecordMap } from "notion-types";
import { NotionRenderer } from "react-notion-x";
// core styles shared by all of react-notion-x (required)
import "react-notion-x/src/styles.css";

// used for code syntax highlighting (optional)
import "prismjs/themes/prism-tomorrow.css";

// used for rendering equations (optional)
import "katex/dist/katex.min.css";

import { Equation } from "react-notion-x/build/third-party/equation";
import { Modal } from "react-notion-x/build/third-party/modal";
import { Code } from "./code-with-mermaid";
import Image from "next/image";
import Link from "next/link";

const PageLink = ({
  href,
  children,
  ...props
}: {
  href: string;
  children: React.ReactNode;
}) => {
  return (
    <Link href={`/article${href}`} {...props}>
      {children}
    </Link>
  );
};

export default function NotionWrapper({
  recordMap,
}: {
  recordMap: ExtendedRecordMap;
}) {
  return (
    <div className="w-dvw">
      <NotionRenderer
        className="selection:bg-[revert]! [&_.notion-full-page]:py-4!"
        recordMap={recordMap}
        components={{
          Code,
          Collection: () => null,
          Equation,
          Modal,
          nextImage: Image,
          nextLink: Link,
          PageLink,
        }}
        disableHeader
        fullPage={true}
        darkMode={false}
      />
    </div>
  );
}
