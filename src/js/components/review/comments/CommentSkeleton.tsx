import { Skeleton } from "@nextui-org/react";

const CommentSkeleton = () => (
  <div className="flex w-full flex-col gap-2 px-3 py-1">
    <div className="flex items-center gap-2 py-2 pl-1.5">
      <Skeleton className="h-6 w-6 flex-shrink-0 rounded-full" />
      <Skeleton className="h-6 w-full max-w-32 rounded-lg" />
    </div>
    <Skeleton className="h-20 w-full rounded-lg" />
  </div>
);

export default CommentSkeleton;
