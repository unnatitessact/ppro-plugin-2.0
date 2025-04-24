import { motion } from 'framer-motion';

export const MetadataTemplatesListEmptyState = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex h-full items-center justify-center text-center text-ds-text-secondary"
    >
      No templates found matching your search
    </motion.div>
  );
};
