'use client';

import { useRef } from 'react';

import { Image } from '@nextui-org/react';
import Barcode from 'react-barcode';

import { CloudUpload } from '@tessact/icons';

import { Button } from '@/components/ui/Button';

import { MetadataInfoItem } from '@/components/library/metadata/MetadataInfoItem';
import { User } from '@/components/library/metadata/User';

import { useAddImageToPhysicalAsset } from '@/api-integration/mutations/library';
import { PhysicalAssetDetails } from '@/api-integration/types/library';
import { PhysicalAssetDetails as ProjectPhysicalAssetDetails } from '@/api-integration/types/projects';

import { formatDateTime } from '@/utils/dates';
import { getColorFromEmail } from '@/utils/reviewUtils';

interface PhysicalAssetPreviewProps {
  asset: PhysicalAssetDetails | ProjectPhysicalAssetDetails;
}

export const PhysicalAssetPreview = ({ asset }: PhysicalAssetPreviewProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const { mutate: addImageToPhysicalAsset, isPending } = useAddImageToPhysicalAsset(asset.id);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-12 dark">
      <div className="group flex aspect-video w-1/2 min-w-80 max-w-md items-center justify-center overflow-hidden rounded-2xl bg-default-200">
        <input
          type="file"
          ref={inputRef}
          hidden
          accept="image/*"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              addImageToPhysicalAsset(e.target.files[0]);
            }
          }}
        />
        {asset.asset_image ? (
          <div className="relative">
            <Image
              src={asset.asset_image}
              alt={asset.name}
              className="aspect-video rounded-none object-contain"
              classNames={{ wrapper: 'flex h-full w-full' }}
            />
            <div className="absolute inset-0 z-30 flex h-full w-full items-center justify-center bg-black/50 opacity-0 transition group-hover:opacity-100">
              <Button
                size="sm"
                color="secondary"
                className="absolute z-50 border border-ds-text-primary/10"
                startContent={<CloudUpload size={20} />}
                onClick={() => inputRef.current?.click()}
                aria-label="Change image"
              >
                Change image
              </Button>
            </div>
          </div>
        ) : (
          <Button
            color="secondary"
            className="border border-ds-text-primary/10"
            startContent={<CloudUpload size={20} />}
            onClick={() => inputRef.current?.click()}
            isLoading={isPending}
            aria-label="Upload image"
          >
            Upload image
          </Button>
        )}
      </div>
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-5">
          <div className="text-ds-text-secondary">
            <Barcode
              renderer="svg"
              displayValue={false}
              value={asset.barcode}
              background="transparent"
              lineColor="currentColor"
              height={58}
            />
          </div>
          <div className="flex flex-col justify-center gap-0.5">
            <div className="font-medium text-ds-text-primary">{asset.name}</div>
            <div className="text-sm text-ds-text-secondary">{asset.barcode}</div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <MetadataInfoItem label="Added on" value={<p>{formatDateTime(asset.created_on)}</p>} />
          <MetadataInfoItem
            label="Added by"
            value={
              <User
                image={asset?.created_by?.profile.profile_picture ?? ''}
                name={
                  asset?.created_by?.profile.display_name ??
                  asset?.external_user?.display_name ??
                  ''
                }
                firstName={
                  asset?.created_by?.profile.first_name ?? asset?.external_user?.display_name ?? ''
                }
                lastName={asset?.created_by?.profile.last_name ?? ''}
                email={asset?.created_by?.email ?? asset?.external_user?.email ?? ''}
                color={
                  asset?.created_by?.profile.color ??
                  getColorFromEmail(asset?.external_user?.email ?? '')
                }
                displayName={
                  asset?.created_by?.profile.display_name ??
                  asset?.external_user?.display_name ??
                  ''
                }
              />
            }
          />
          <MetadataInfoItem
            label="Last Modified"
            value={<p>{formatDateTime(asset.modified_on)}</p>}
          />
          <MetadataInfoItem
            label="Modified by"
            value={
              <User
                image={asset?.modified_by?.profile.profile_picture ?? ''}
                name={
                  asset?.modified_by?.profile.display_name ??
                  asset?.external_user?.display_name ??
                  ''
                }
                firstName={
                  asset?.modified_by?.profile.first_name ?? asset?.external_user?.display_name ?? ''
                }
                lastName={asset?.modified_by?.profile.last_name ?? ''}
                email={asset?.modified_by?.email ?? asset?.external_user?.email ?? ''}
                color={
                  asset?.modified_by?.profile.color ??
                  getColorFromEmail(asset?.external_user?.email ?? '')
                }
                displayName={
                  asset?.modified_by?.profile.display_name ??
                  asset?.external_user?.display_name ??
                  ''
                }
              />
            }
          />
        </div>
      </div>
    </div>
  );
};
