interface TableEmptyStateProps {
  title: string;
  description?: string;
}

export const TableEmptyState = ({ title, description }: TableEmptyStateProps) => {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-1 text-center">
      <h3 className="text-lg">{title}</h3>
      <p className="max-w-md text-sm text-ds-text-secondary">{description}</p>
    </div>
  );
};
