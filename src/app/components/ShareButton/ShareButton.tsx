"use client";

import { useState } from "react";
import { FaLink } from "react-icons/fa";

export default function ShareButton({ url }) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // 2초 후 복사 완료 메시지 숨김
      })
      .catch((error) => {
        console.error("Error copying text: ", error);
      });
  };

  return (
    <div className="flex items-center">
      <FaLink />
      <button className="" onClick={handleCopyLink}>
        {copied ? "링크가 복사되었습니다!" : "공유하기"}
      </button>
    </div>
  );
}
