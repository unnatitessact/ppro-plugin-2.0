import pluralize from 'pluralize';
import prettyBytes from 'pretty-bytes';

import { Folder1Filled } from '@tessact/icons';

import { MetadataInfoItem } from '@/components/library/metadata/MetadataInfoItem';
import { User } from '@/components/library/metadata/User';

import { useAssetDetailsQuery } from '@/api-integration/queries/library';

import { formatDateTime } from '@/utils/dates';
import { getColorFromEmail } from '@/utils/reviewUtils';

interface FolderMetadataInfoProps {
  folderId: string;
}

export const FolderMetadataInfo = ({ folderId }: FolderMetadataInfoProps) => {
  const { data, isLoading } = useAssetDetailsQuery(folderId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (data?.resourcetype !== 'Folder') {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-1 font-medium">
        <Folder1Filled size={96} className="text-ds-asset-preview-text-secondary" />
        <h3 className="max-w-sm truncate md:max-w-md lg:max-w-lg xl:max-w-xl">{data.name}</h3>
        {data?.total_files && data?.total_folders && (
          <p className="text-sm text-ds-asset-preview-text-secondary">
            {data.total_files} total {pluralize('file', data.total_files)}, {data.total_folders}{' '}
            total {pluralize('folder', data.total_folders)}
          </p>
        )}
        {data?.total_size && (
          <p className="text-sm font-medium text-ds-asset-preview-text-secondary">
            {prettyBytes(data.total_size)}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        {data?.created_on && (
          <MetadataInfoItem label="Created on" value={<p>{formatDateTime(data.created_on)}</p>} />
        )}
        {data?.created_by && (
          <MetadataInfoItem
            label="Created by"
            value={
              <User
                image={data?.created_by?.profile.profile_picture ?? ''}
                name={
                  data?.created_by?.profile.display_name ?? data?.external_user?.display_name ?? ''
                }
                firstName={
                  data?.created_by?.profile.first_name ?? data?.external_user?.display_name ?? ''
                }
                lastName={data?.created_by?.profile.last_name ?? ''}
                email={data?.created_by?.email ?? data?.external_user?.email ?? ''}
                color={
                  data?.created_by?.profile.color ??
                  getColorFromEmail(data?.external_user?.email ?? '')
                }
                displayName={
                  data?.created_by?.profile.display_name ?? data?.external_user?.display_name ?? ''
                }
              />
            }
          />
        )}

        {data?.modified_on && (
          <MetadataInfoItem
            label="Last Modified"
            value={<p>{formatDateTime(data.modified_on)}</p>}
          />
        )}

        {data?.modified_by && (
          <MetadataInfoItem
            label="Modified by"
            value={
              <User
                image={data?.modified_by?.profile.profile_picture ?? ''}
                name={
                  data?.modified_by?.profile.display_name ?? data?.external_user?.display_name ?? ''
                }
                firstName={
                  data?.modified_by?.profile.first_name ?? data?.external_user?.display_name ?? ''
                }
                lastName={data?.modified_by?.profile.last_name ?? ''}
                email={data?.modified_by?.email ?? data?.external_user?.email ?? ''}
                color={
                  data?.modified_by?.profile.color ??
                  getColorFromEmail(data?.external_user?.email ?? '')
                }
                displayName={
                  data?.modified_by?.profile.display_name ?? data?.external_user?.display_name ?? ''
                }
              />
            }
          />
        )}
      </div>
    </div>
  );
};
