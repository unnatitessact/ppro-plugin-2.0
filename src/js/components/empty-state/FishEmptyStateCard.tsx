interface FishEmptyStateCardProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const FishEmptyStateCard = ({ title, description, action }: FishEmptyStateCardProps) => {
  return (
    <div className="noise flex w-full max-w-80 flex-col gap-10 rounded-[20px] border border-black/[3%] bg-ds-menu-bg p-8 dark:border-white/5">
      <div className="h-40 w-full bg-whale bg-contain bg-center bg-no-repeat"></div>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-ds-text-secondary">{description}</p>
        </div>
        {action}
      </div>
    </div>
  );
};
