"use client";
import { ExtendedRecordMap } from "notion-types";
import { NotionRenderer } from "react-notion-x";
// core styles shared by all of react-notion-x (required)
import "react-notion-x/src/styles.css";

// used for code syntax highlighting (optional)
import "prismjs/themes/prism-tomorrow.css";

// used for rendering equations (optional)
import "katex/dist/katex.min.css";

import { Collection } from "react-notion-x/build/third-party/collection";
import { Equation } from "react-notion-x/build/third-party/equation";
import { Modal } from "react-notion-x/build/third-party/modal";
import { Pdf } from "react-notion-x/build/third-party/pdf";
import { Code } from "./code-with-mermaid";

export default function NotionWrapper({
  recordMap,
}: {
  recordMap: ExtendedRecordMap;
}) {
  return (
    <div className="w-dvw">
      <NotionRenderer
        recordMap={recordMap}
        components={{ Code, Collection, Equation, Modal, Pdf }}
        disableHeader
        fullPage={true}
        darkMode={false}
      />
    </div>
  );
}
