import { Skeleton } from '@nextui-org/react';

export const AssetCardSkeleton = () => {
  return <div className="h-48 w-full rounded-xl bg-ds-menu-bg" />;
};

export const AssetCardFetchingSkeleton = () => {
  return (
    <div className="h-full min-h-56 w-full p-3">
      <div className="h-full w-full animate-pulse rounded-[20px] border border-black/[3%] bg-ds-menu-bg-hover dark:border-white/5" />
    </div>
  );
};

export const ProjectCardSkeleton = () => {
  return (
    <div className="flex flex-col gap-2 rounded-[20px] p-3">
      <Skeleton className="aspect-[4/3] rounded-[20px]" />
      <div className="flex flex-col gap-1.5"></div>
    </div>
  );
};
