import { cn, Skeleton } from '@nextui-org/react';

export const MetadataSkeleton = () => {
  return (
    <div className="flex h-full min-h-0 w-full flex-col gap-1">
      <div
        className={cn('px-2 py-3', 'flex flex-wrap items-center justify-between gap-x-5 gap-y-2')}
      >
        <Skeleton className="h-6 w-1/4 rounded" />
        <Skeleton className="h-5 w-1/2" />
      </div>
      <div
        className={cn('px-2 py-3', 'flex flex-wrap items-center justify-between gap-x-5 gap-y-2')}
      >
        <Skeleton className="h-6 w-1/4 rounded" />
        <div className="flex flex-1 items-center justify-end gap-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-1/2 rounded" />
        </div>
      </div>
      <div className={cn('px-2 py-3', 'flex flex-col gap-y-4')}>
        <Skeleton className="h-6 w-1/4 rounded" />
        <div className="flex flex-col gap-1">
          <Skeleton className="h-6 w-full rounded" />
          <Skeleton className="h-6 w-full rounded" />
          <Skeleton className="h-6 w-1/2 rounded" />
        </div>
      </div>
      <div
        className={cn('px-2 py-3', 'flex flex-wrap items-center justify-between gap-x-5 gap-y-2')}
      >
        <Skeleton className="h-6 w-1/4 rounded" />
        <Skeleton className="h-6 w-1/2 rounded" />
      </div>
      <div
        className={cn('px-2 py-3', 'flex flex-wrap items-center justify-between gap-x-5 gap-y-2')}
      >
        <Skeleton className="h-6 w-1/4 rounded" />
        <div className="flex flex-1 items-center justify-end gap-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-1/2 rounded" />
        </div>
      </div>
      <div className={cn('px-2 py-3', 'flex flex-col gap-y-4')}>
        <Skeleton className="h-6 w-1/4 rounded" />
        <Skeleton className="h-20 w-full rounded" />
      </div>
      <div
        className={cn('px-2 py-3', 'flex flex-wrap items-center justify-between gap-x-5 gap-y-2')}
      >
        <Skeleton className="h-6 w-1/4 rounded" />
        <Skeleton className="h-6 w-1/2 rounded" />
      </div>
      <div
        className={cn('px-2 py-3', 'flex flex-wrap items-center justify-between gap-x-5 gap-y-2')}
      >
        <Skeleton className="h-6 w-1/4 rounded" />
        <div className="flex flex-1 items-center justify-end gap-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-1/2 rounded" />
        </div>
      </div>
      <div className={cn('px-2 py-3', 'flex flex-col gap-y-4')}>
        <Skeleton className="h-6 w-1/4 rounded" />
        <div className="flex flex-col gap-1">
          <Skeleton className="h-6 w-full rounded" />
          <Skeleton className="h-6 w-full rounded" />
          <Skeleton className="h-6 w-full rounded" />
        </div>
      </div>
    </div>
  );
};
