import { Button } from '@/components/ui/Button';

import { VersionStackAsset } from '@/api-integration/types/library';

import { useLibraryStore } from '@/stores/library-store';

interface VersionModalButtonProps {
  versionStack: VersionStackAsset;
}

export const VersionModalButton = ({ versionStack }: VersionModalButtonProps) => {
  const { setSelectedVersionStackId } = useLibraryStore();

  const versions = versionStack?.versions ?? [];

  if (!versionStack || versions.length === 0) return null;

  return (
    <Button
      isIconOnly
      size="sm"
      variant="light"
      color="secondary"
      className="ml-auto h-6 self-end rounded-lg px-1  text-sm text-ds-text-primary focus:outline-none dark:bg-default-300 data-[hover=true]:dark:bg-default-400"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedVersionStackId(versionStack?.id);
      }}
      aria-label="Version modal"
    >
      v{versions.length}
    </Button>
  );
};
