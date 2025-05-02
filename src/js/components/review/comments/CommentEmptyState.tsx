import React from "react";
import { useSearchParams } from "react-router-dom";
// import { useSearchParams } from "next/navigation";

import { Bubble2 } from "@tessact/icons";

const CommentsEmptyState = () => {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("query")?.toString();
  return (
    <div className="flex h-full flex-col items-center justify-center text-ds-text-secondary">
      <Bubble2 size={24} />
      <p className="font-medium ">
        {search ? `No comments found for ${search}` : "No comments yet"}
      </p>
      <p className="max-w-56 text-center text-sm text-default-400">
        Any new comments will be displayed here as soon as they&apos;re added.
      </p>
    </div>
  );
};

export default CommentsEmptyState;
