import { Skeleton } from '@nextui-org/react';

export const SecurityGroupLoadingState = () => {
  return (
    <div className="flex justify-between gap-1 px-3 py-4">
      <div className="flex w-full items-center gap-1">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-4 w-32 rounded-md" />
          <Skeleton className="h-3 w-16 rounded-md" />
        </div>
      </div>
      <Skeleton className="h-6 w-32 rounded-md" />
    </div>
  );
};

export const UserLoadingState = () => {
  return (
    <div className="flex justify-between gap-1 px-3 py-4">
      <div className="flex w-full items-center gap-1">
        <Skeleton className="h-8 w-8 rounded-full" />

        <div className="flex flex-col gap-1">
          <Skeleton className="h-4 w-32 rounded-md" />
          <Skeleton className="h-3 w-16 rounded-md" />
        </div>
      </div>
      <Skeleton className="h-6 w-32 rounded-md" />
    </div>
  );
};
