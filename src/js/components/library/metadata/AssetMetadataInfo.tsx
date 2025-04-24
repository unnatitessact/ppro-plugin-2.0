import prettyBytes from 'pretty-bytes';

import { FileBendFilled } from '@tessact/icons';

import { ScrollShadow } from '@/components/ui/ScrollShadow';

import { MetadataInfoItem } from '@/components/library/metadata/MetadataInfoItem';
import { User } from '@/components/library/metadata/User';

import { AssetDetails } from '@/api-integration/types/library';
import { AssetDetails as ProjectAssetDetails } from '@/api-integration/types/projects';

import { formatDateTime } from '@/utils/dates';
import { getColorFromEmail } from '@/utils/reviewUtils';

interface AssetMetadataInfoProps {
  data: AssetDetails | ProjectAssetDetails | undefined;
}

export const AssetMetadataInfo = ({ data }: AssetMetadataInfoProps) => {
  if (data?.resourcetype === 'VideoFile' || data?.resourcetype === 'ProjectVideoFile') {
    return (
      <ScrollShadow className="h-full w-full px-8 pb-8 pt-32" showTopBorder={false}>
        <div className="flex flex-col gap-6">
          <FileInfo fileName={data.name} fileSize={data.size} />
          <div className="flex flex-col gap-2">
            <MetadataInfoItem
              label="Resolution"
              value={
                <p>
                  {data.video_width}x{data.video_height}
                </p>
              }
            />
            <MetadataInfoItem
              label="File Extension"
              value={<p className="uppercase">{data.file_extension}</p>}
            />
            <MetadataInfoItem label="Codec" value={<p>{data.codec || 'N/A'}</p>} />
            <MetadataInfoItem
              label="Uploaded on"
              value={<p>{formatDateTime(data.created_on)}</p>}
            />
            <MetadataInfoItem
              label="Uploaded by"
              value={
                <User
                  image={data?.created_by?.profile.profile_picture}
                  name={
                    data?.created_by?.profile.display_name ??
                    data?.external_user?.display_name ??
                    ''
                  }
                  firstName={
                    data?.created_by?.profile.first_name ?? data?.external_user?.display_name ?? ''
                  }
                  lastName={
                    data?.created_by?.profile.last_name ?? data?.external_user?.display_name ?? ''
                  }
                  email={data?.created_by?.email ?? data?.external_user?.email ?? ''}
                  color={
                    data?.created_by?.profile.color ??
                    getColorFromEmail(data?.external_user?.email ?? '')
                  }
                  displayName={
                    data?.created_by?.profile.display_name ??
                    data?.external_user?.display_name ??
                    ''
                  }
                />
              }
            />
            <MetadataInfoItem
              label="Last Modified"
              value={<p>{formatDateTime(data.modified_on)}</p>}
            />
            <MetadataInfoItem
              label="Modified by"
              value={
                <User
                  image={data?.modified_by?.profile.profile_picture}
                  name={
                    data?.modified_by?.profile.display_name ??
                    data?.external_user?.display_name ??
                    ''
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
                />
              }
            />
            {Object.entries(data.technical_metadata).map(([key, value]) => {
              if (typeof value !== 'string') {
                return null;
              }

              return <MetadataInfoItem key={key} label={key} value={<p>{value}</p>} />;
            })}
          </div>
        </div>
      </ScrollShadow>
    );
  }

  if (data?.resourcetype === 'AudioFile' || data?.resourcetype === 'ProjectAudioFile') {
    return (
      <ScrollShadow className="h-full w-full px-8 pb-8 pt-32">
        <div className="flex flex-col gap-6">
          <FileInfo fileName={data.name} fileSize={data.size} />
          <div className="flex flex-col gap-2">
            <MetadataInfoItem
              label="File Extension"
              value={<p className="uppercase">{data.file_extension}</p>}
            />
            <MetadataInfoItem
              label="Uploaded on"
              value={<p>{formatDateTime(data.created_on)}</p>}
            />
            <MetadataInfoItem
              label="Uploaded by"
              value={
                <User
                  image={data?.created_by?.profile.profile_picture}
                  name={
                    data?.created_by?.profile.display_name ??
                    data?.external_user?.display_name ??
                    ''
                  }
                  firstName={
                    data?.created_by?.profile.first_name ?? data?.external_user?.display_name ?? ''
                  }
                  lastName={data?.created_by?.profile.last_name ?? ''}
                  email={data?.created_by?.email ?? data?.external_user?.email}
                  color={
                    data?.created_by?.profile.color ??
                    getColorFromEmail(data?.external_user?.email ?? '')
                  }
                  displayName={
                    data?.created_by?.profile.display_name ?? data?.external_user?.display_name
                  }
                />
              }
            />
            <MetadataInfoItem
              label="Last Modified"
              value={<p>{formatDateTime(data.modified_on)}</p>}
            />
            <MetadataInfoItem
              label="Modified by"
              value={
                <User
                  image={data?.modified_by?.profile.profile_picture}
                  name={
                    data?.modified_by?.profile.display_name ??
                    data?.external_user?.display_name ??
                    ''
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
                    data?.modified_by?.profile.display_name ??
                    data?.external_user?.display_name ??
                    ''
                  }
                />
              }
            />
            {Object.entries(data.technical_metadata).map(([key, value]) => {
              if (typeof value !== 'string') {
                return null;
              }

              return <MetadataInfoItem key={key} label={key} value={<p>{value}</p>} />;
            })}
          </div>
        </div>
      </ScrollShadow>
    );
  }

  if (data?.resourcetype === 'ImageFile' || data?.resourcetype === 'ProjectImageFile') {
    return (
      <ScrollShadow className="h-full w-full px-8 pb-8 pt-32">
        <div className="flex flex-col gap-6">
          <FileInfo fileName={data.name} fileSize={data.size} />
          <div className="flex flex-col gap-2">
            {!!data.resolution.width && !!data.resolution.height && (
              <MetadataInfoItem
                label="Resolution"
                value={
                  <p>
                    {data.resolution.width}x{data.resolution.height}
                  </p>
                }
              />
            )}
            <MetadataInfoItem
              label="File Extension"
              value={<p className="uppercase">{data.file_extension}</p>}
            />
            <MetadataInfoItem
              label="Uploaded on"
              value={<p>{formatDateTime(data.created_on)}</p>}
            />
            <MetadataInfoItem
              label="Uploaded by"
              value={
                <User
                  image={data?.created_by?.profile.profile_picture}
                  name={
                    data?.created_by?.profile.display_name ??
                    data?.external_user?.display_name ??
                    ''
                  }
                  firstName={
                    data?.created_by?.profile.first_name ?? data?.external_user?.display_name ?? ''
                  }
                  lastName={data?.created_by?.profile.last_name ?? ''}
                  email={data?.created_by?.email ?? data?.external_user?.email}
                  color={
                    data?.created_by?.profile.color ??
                    getColorFromEmail(data?.external_user?.email ?? '')
                  }
                  displayName={
                    data?.created_by?.profile.display_name ??
                    data?.external_user?.display_name ??
                    ''
                  }
                />
              }
            />
            <MetadataInfoItem
              label="Last Modified"
              value={<p>{formatDateTime(data.modified_on)}</p>}
            />
            <MetadataInfoItem
              label="Modified by"
              value={
                <User
                  image={data?.modified_by?.profile.profile_picture}
                  name={
                    data?.modified_by?.profile.display_name ??
                    data?.external_user?.display_name ??
                    ''
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
                    data?.modified_by?.profile.display_name ??
                    data?.external_user?.display_name ??
                    ''
                  }
                />
              }
            />
            {Object.entries(data.technical_metadata).map(([key, value]) => {
              if (typeof value !== 'string') {
                return null;
              }

              return <MetadataInfoItem key={key} label={key} value={<p>{value}</p>} />;
            })}
          </div>
        </div>
      </ScrollShadow>
    );
  }

  if (data?.resourcetype === 'File' || data?.resourcetype === 'ProjectFile') {
    return (
      <ScrollShadow className="flex h-full w-full items-center justify-center px-8">
        <div className="flex flex-col gap-6">
          <FileInfo fileName={data.name} fileSize={data.size} />
          <div className="flex flex-col gap-2">
            <MetadataInfoItem
              label="File Extension"
              value={<p className="uppercase">{data.file_extension}</p>}
            />
            <MetadataInfoItem
              label="Uploaded on"
              value={<p>{formatDateTime(data.created_on)}</p>}
            />
            <MetadataInfoItem
              label="Uploaded by"
              value={
                <User
                  image={data?.created_by?.profile.profile_picture}
                  name={
                    data?.created_by?.profile.display_name ??
                    data?.external_user?.display_name ??
                    ''
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
                    data?.created_by?.profile.display_name ??
                    data?.external_user?.display_name ??
                    ''
                  }
                />
              }
            />
            <MetadataInfoItem
              label="Last Modified"
              value={<p>{formatDateTime(data.modified_on)}</p>}
            />
            <MetadataInfoItem
              label="Modified by"
              value={
                <User
                  image={data?.modified_by?.profile.profile_picture}
                  name={
                    data?.modified_by?.profile.display_name ??
                    data?.external_user?.display_name ??
                    ''
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
                    data?.modified_by?.profile.display_name ??
                    data?.external_user?.display_name ??
                    ''
                  }
                />
              }
            />
            {Object.entries(data.technical_metadata).map(([key, value]) => {
              if (typeof value !== 'string') {
                return null;
              }

              return <MetadataInfoItem key={key} label={key} value={<p>{value}</p>} />;
            })}
          </div>
        </div>
      </ScrollShadow>
    );
  }

  return null;
};

const FileInfo = ({ fileName, fileSize }: { fileName: string; fileSize: number }) => {
  return (
    <div className="flex w-full flex-col items-center gap-1 overflow-hidden font-medium">
      <FileBendFilled size={96} className="text-ds-asset-preview-text-secondary" />
      <h3 className="max-w-sm truncate md:max-w-md lg:max-w-lg xl:max-w-xl">{fileName}</h3>
      <p className="text-sm text-ds-asset-preview-text-secondary">{prettyBytes(fileSize)}</p>
    </div>
  );
};
