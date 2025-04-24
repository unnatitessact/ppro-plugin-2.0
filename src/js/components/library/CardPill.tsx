import type { ReactNode } from 'react';

import { cn } from '@nextui-org/react';

export const CardPill = ({ children, className }: { children: ReactNode; className?: string }) => {
  return (
    <div
      className={cn(
        'bg-ds-asset-card-card-bg text-sm text-ds-text-secondary',
        'rounded-full p-2',
        'border border-black/[3%] dark:border-white/5',
        'flex items-center gap-[1px]',
        className
      )}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      {children}
    </div>
  );
};
