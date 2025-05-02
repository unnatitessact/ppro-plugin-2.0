// import { useParams, useSearchParams } from 'next/navigation';

import { useParams, useSearchParams } from "react-router-dom";

import { ScrollShadow } from "@/components/ui/ScrollShadow";

import { TechnicalMetadataItem } from "./TechnicalMetadataItem";
// import { TechnicalMetadataItem } from "@/components/review/TechnicalMetadataItem";
import { User } from "@/components/ui/User";

import { useAssetDetailsQuery } from "@/api-integration/queries/library";
import { AssetDetails } from "@/api-integration/types/library";
import { AssetDetails as ProjectAssetDetails } from "@/api-integration/types/projects";

import { formatDateTime } from "@/utils/dates";
import { getColorFromEmail } from "@/utils/reviewUtils";

interface TechnicalMetadataProps {
  data: AssetDetails | ProjectAssetDetails | undefined;
}

export const TechnicalMetadata = ({ data }: TechnicalMetadataProps) => {
  if (
    data?.resourcetype === "VideoFile" ||
    data?.resourcetype === "ProjectVideoFile"
  ) {
    return (
      <ScrollShadow className="h-full w-full p-4" showTopBorder={false}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <TechnicalMetadataItem
              label="Resolution"
              value={
                <p>
                  {data.video_width}x{data.video_height}
                </p>
              }
            />
            <TechnicalMetadataItem
              label="File Extension"
              value={<p className="uppercase">{data.file_extension}</p>}
            />
            <TechnicalMetadataItem
              label="Codec"
              value={<p>{data.codec || "N/A"}</p>}
            />
            <TechnicalMetadataItem
              label="Uploaded on"
              value={<p>{formatDateTime(data.created_on)}</p>}
            />
            <TechnicalMetadataItem
              label="Uploaded by"
              value={
                <User
                  // @ts-ignore
                  image={data?.created_by?.profile.profile_picture ?? ""}
                  name={
                    data?.created_by?.profile.display_name ??
                    data?.external_user?.display_name ??
                    ""
                  }
                  firstName={
                    data?.created_by?.profile.first_name ??
                    data?.external_user?.display_name ??
                    ""
                  }
                  lastName={data?.created_by?.profile.last_name ?? ""}
                  email={
                    data?.created_by?.email ?? data?.external_user?.email ?? ""
                  }
                  color={
                    data?.created_by?.profile.color ??
                    getColorFromEmail(data?.external_user?.email ?? "")
                  }
                  displayName={
                    data?.created_by?.profile.display_name ??
                    data?.external_user?.display_name ??
                    ""
                  }
                />
              }
            />
            <TechnicalMetadataItem
              label="Last Modified"
              value={<p>{formatDateTime(data.modified_on)}</p>}
            />
            <TechnicalMetadataItem
              label="Modified by"
              value={
                <User
                  // @ts-ignore
                  image={data?.modified_by?.profile.profile_picture ?? ""}
                  name={
                    data?.modified_by?.profile.display_name ??
                    data?.external_user?.display_name ??
                    ""
                  }
                  firstName={
                    data?.modified_by?.profile.first_name ??
                    data?.external_user?.display_name ??
                    ""
                  }
                  lastName={data?.modified_by?.profile.last_name ?? ""}
                  email={
                    data?.modified_by?.email ?? data?.external_user?.email ?? ""
                  }
                  color={
                    data?.modified_by?.profile.color ??
                    getColorFromEmail(data?.external_user?.email ?? "")
                  }
                  displayName={
                    data?.modified_by?.profile.display_name ??
                    data?.external_user?.display_name ??
                    ""
                  }
                />
              }
            />
            {Object.entries(data.technical_metadata).map(([key, value]) => {
              if (typeof value !== "string") {
                return null;
              }

              return (
                <TechnicalMetadataItem
                  key={key}
                  label={key}
                  value={<p>{value}</p>}
                />
              );
            })}
          </div>
        </div>
      </ScrollShadow>
    );
  }

  if (
    data?.resourcetype === "AudioFile" ||
    data?.resourcetype === "ProjectAudioFile"
  ) {
    return (
      <ScrollShadow className="h-full w-full p-4">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <TechnicalMetadataItem
              label="File Extension"
              value={<p className="uppercase">{data.file_extension}</p>}
            />
            <TechnicalMetadataItem
              label="Uploaded on"
              value={<p>{formatDateTime(data.created_on)}</p>}
            />
            <TechnicalMetadataItem
              label="Uploaded by"
              value={
                <User
                  // @ts-ignore
                  image={data?.created_by?.profile.profile_picture ?? ""}
                  name={
                    data?.created_by?.profile.display_name ??
                    data?.external_user?.display_name ??
                    ""
                  }
                  firstName={
                    data?.created_by?.profile.first_name ??
                    data?.external_user?.display_name ??
                    ""
                  }
                  lastName={data?.created_by?.profile.last_name ?? ""}
                  email={
                    data?.created_by?.email ?? data?.external_user?.email ?? ""
                  }
                  color={
                    data?.created_by?.profile.color ??
                    getColorFromEmail(data?.external_user?.email ?? "")
                  }
                  displayName={
                    data?.created_by?.profile.display_name ??
                    data?.external_user?.display_name ??
                    ""
                  }
                />
              }
            />
            <TechnicalMetadataItem
              label="Last Modified"
              value={<p>{formatDateTime(data.modified_on)}</p>}
            />
            <TechnicalMetadataItem
              label="Modified by"
              value={
                <User
                  // @ts-ignore
                  image={data?.modified_by?.profile.profile_picture ?? ""}
                  name={
                    data?.modified_by?.profile.display_name ??
                    data?.external_user?.display_name ??
                    ""
                  }
                  firstName={
                    data?.modified_by?.profile.first_name ??
                    data?.external_user?.display_name ??
                    ""
                  }
                  lastName={data?.modified_by?.profile.last_name ?? ""}
                  email={
                    data?.modified_by?.email ?? data?.external_user?.email ?? ""
                  }
                  color={
                    data?.modified_by?.profile.color ??
                    getColorFromEmail(data?.external_user?.email ?? "")
                  }
                  displayName={
                    data?.modified_by?.profile.display_name ??
                    data?.external_user?.display_name ??
                    ""
                  }
                />
              }
            />
            {Object.entries(data.technical_metadata).map(([key, value]) => {
              if (typeof value !== "string") {
                return null;
              }

              return (
                <TechnicalMetadataItem
                  key={key}
                  label={key}
                  value={<p>{value}</p>}
                />
              );
            })}
          </div>
        </div>
      </ScrollShadow>
    );
  }

  if (
    data?.resourcetype === "ImageFile" ||
    data?.resourcetype === "ProjectImageFile"
  ) {
    return (
      <ScrollShadow className="h-full w-full p-4">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            {!!data.resolution.width && !!data.resolution.height && (
              <TechnicalMetadataItem
                label="Resolution"
                value={
                  <p>
                    {data.resolution.width}x{data.resolution.height}
                  </p>
                }
              />
            )}
            <TechnicalMetadataItem
              label="File Extension"
              value={<p className="uppercase">{data.file_extension}</p>}
            />
            <TechnicalMetadataItem
              label="Uploaded on"
              value={<p>{formatDateTime(data.created_on)}</p>}
            />
            <TechnicalMetadataItem
              label="Uploaded by"
              value={
                <User
                  // @ts-ignore
                  image={data?.created_by?.profile.profile_picture ?? ""}
                  name={
                    data?.created_by?.profile.display_name ??
                    data?.external_user?.display_name ??
                    ""
                  }
                  firstName={
                    data?.created_by?.profile.first_name ??
                    data?.external_user?.display_name ??
                    ""
                  }
                  lastName={data?.created_by?.profile.last_name ?? ""}
                  email={
                    data?.created_by?.email ?? data?.external_user?.email ?? ""
                  }
                  color={
                    data?.created_by?.profile.color ??
                    getColorFromEmail(data?.external_user?.email ?? "")
                  }
                  displayName={
                    data?.created_by?.profile.display_name ??
                    data?.external_user?.display_name ??
                    ""
                  }
                />
              }
            />
            <TechnicalMetadataItem
              label="Last Modified"
              value={<p>{formatDateTime(data.modified_on)}</p>}
            />
            <TechnicalMetadataItem
              label="Modified by"
              value={
                <User
                  // @ts-ignore
                  image={data?.modified_by?.profile.profile_picture ?? ""}
                  name={
                    data?.modified_by?.profile.display_name ??
                    data?.external_user?.display_name ??
                    ""
                  }
                  firstName={
                    data?.modified_by?.profile.first_name ??
                    data?.external_user?.display_name ??
                    ""
                  }
                  lastName={data?.modified_by?.profile.last_name ?? ""}
                  email={
                    data?.modified_by?.email ?? data?.external_user?.email ?? ""
                  }
                  color={
                    data?.modified_by?.profile.color ??
                    getColorFromEmail(data?.external_user?.email ?? "")
                  }
                  displayName={
                    data?.modified_by?.profile.display_name ??
                    data?.external_user?.display_name ??
                    ""
                  }
                />
              }
            />
            {Object.entries(data.technical_metadata).map(([key, value]) => {
              if (typeof value !== "string") {
                return null;
              }

              return (
                <TechnicalMetadataItem
                  key={key}
                  label={key}
                  value={<p>{value}</p>}
                />
              );
            })}
          </div>
        </div>
      </ScrollShadow>
    );
  }

  if (data?.resourcetype === "File" || data?.resourcetype === "ProjectFile") {
    return (
      <ScrollShadow className="flex h-full w-full items-center justify-center px-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <TechnicalMetadataItem
              label="File Extension"
              value={<p className="uppercase">{data.file_extension}</p>}
            />
            <TechnicalMetadataItem
              label="Uploaded on"
              value={<p>{formatDateTime(data.created_on)}</p>}
            />
            <TechnicalMetadataItem
              label="Uploaded by"
              value={
                <User
                  // @ts-ignore
                  image={data?.created_by?.profile.profile_picture ?? ""}
                  name={
                    data?.created_by?.profile.display_name ??
                    data?.external_user?.display_name ??
                    ""
                  }
                  firstName={
                    data?.created_by?.profile.first_name ??
                    data?.external_user?.display_name ??
                    ""
                  }
                  lastName={data?.created_by?.profile.last_name ?? ""}
                  email={
                    data?.created_by?.email ?? data?.external_user?.email ?? ""
                  }
                  color={
                    data?.created_by?.profile.color ??
                    getColorFromEmail(data?.external_user?.email ?? "")
                  }
                  displayName={
                    data?.created_by?.profile.display_name ??
                    data?.external_user?.display_name ??
                    ""
                  }
                />
              }
            />
            <TechnicalMetadataItem
              label="Last Modified"
              value={<p>{formatDateTime(data.modified_on)}</p>}
            />
            <TechnicalMetadataItem
              label="Modified by"
              value={
                <User
                  // @ts-ignore
                  image={data?.modified_by?.profile.profile_picture ?? ""}
                  name={
                    data?.modified_by?.profile.display_name ??
                    data?.external_user?.display_name ??
                    ""
                  }
                  firstName={
                    data?.modified_by?.profile.first_name ??
                    data?.external_user?.display_name ??
                    ""
                  }
                  lastName={data?.modified_by?.profile.last_name ?? ""}
                  email={
                    data?.modified_by?.email ?? data?.external_user?.email ?? ""
                  }
                  color={
                    data?.modified_by?.profile.color ??
                    getColorFromEmail(data?.external_user?.email ?? "")
                  }
                  displayName={
                    data?.modified_by?.profile.display_name ??
                    data?.external_user?.display_name ??
                    ""
                  }
                />
              }
            />
            {Object.entries(data.technical_metadata).map(([key, value]) => {
              if (typeof value !== "string") {
                return null;
              }

              return (
                <TechnicalMetadataItem
                  key={key}
                  label={key}
                  value={<p>{value}</p>}
                />
              );
            })}
          </div>
        </div>
      </ScrollShadow>
    );
  }

  return null;
};

export const TechnicalMetadataMobile = ({ data }: TechnicalMetadataProps) => {
  return (
    <div className="flex flex-col gap-1">
      <TechnicalMetadata data={data} />
    </div>
  );
};

export const TechnicalMetadataMobileLibrary = () => {
  const { assetId: fileId } = useParams() as { assetId: string };
  const [searchParams] = useSearchParams();

  const assetId = searchParams.get("version") ?? fileId;

  const { data: assetDetails } = useAssetDetailsQuery(assetId as string);

  return (
    <div>
      <TechnicalMetadata data={assetDetails} />
    </div>
  );
};
