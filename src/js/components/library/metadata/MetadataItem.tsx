import type { ReactNode } from 'react';

import { cn } from '@nextui-org/react';
import { motion } from 'framer-motion';

import { MetadataFieldType } from '@/api-integration/types/metadata';

interface MetadataItemProps {
  label: string;
  value: ReactNode | string;
  type: MetadataFieldType;
}

export const MetadataItem = ({ label, value, type }: MetadataItemProps) => {
  if (type === 'text_area') {
    return (
      <motion.div layout="position" className={cn('px-2 py-3', 'flex flex-col gap-2')}>
        <div className="flex flex-wrap items-center justify-between gap-x-5">
          <p className="text-ds-text-secondary">{label}</p>
          <p className="text-ds-text-secondary">{value?.toString().length} characters</p>
        </div>
        <p className="line-clamp-3 text-ds-text-primary">{value || 'N/A'}</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout="position"
      className={cn('px-2 py-3', 'flex flex-wrap items-center justify-between gap-x-5 gap-y-2')}
    >
      <p className="text-ds-text-secondary">{label}</p>
      <div className="line-clamp-3 text-ds-text-primary">{value || 'N/A'}</div>
    </motion.div>
  );
};
