"use client";

import { Key, useEffect, useRef, useState } from "react";

// import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';

// import { RenderButton } from '@/features/editor-v2/components/rendering/render-button';
// import { ResizeVideo } from '@/features/editor/components/Navbar';
// import { SaveStatus } from '@/features/editor/components/SaveButton';
import { useHotkeys, useMediaQuery } from "@mantine/hooks";
import { ButtonGroup, cn, useDisclosure } from "@nextui-org/react";
// import { useQueryClient } from '@tanstack/react-query';
import prettyBytes from "pretty-bytes";

import { Link, useNavigate, useSearchParams } from "react-router-dom";

import {
  ArrowInbox,
  ArrowLeft,
  ArrowTopBottom,
  BulletList,
  ChevronDownSmall,
  ChevronRightSmallFilled,
  CircleInfo,
  CloudUpload,
  DotGrid1X3Horizontal,
  FileDownload,
  Filter2,
  // FilterTimeline,
  FolderAdd,
  LayoutGrid2,
  LayoutRight,
} from "@tessact/icons";

import { Button } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Divider";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@/components/ui/Dropdown";
import {
  DropdownMenu as RadixDropdownMenu,
  DropdownMenuContent as RadixDropdownMenuContent,
  DropdownMenuItem as RadixDropdownMenuItem,
  DropdownMenuPortal as RadixDropdownMenuPortal,
  DropdownMenuSub as RadixDropdownMenuSub,
  DropdownMenuSubContent as RadixDropdownMenuSubContent,
  DropdownMenuSubTrigger as RadixDropdownMenuSubTrigger,
  DropdownMenuTrigger as RadixDropdownMenuTrigger,
} from "@/components/ui/RadixDropdown";
import { Tooltip } from "@/components/ui/Tooltip";

import { useParams } from "react-router-dom";

import { NewCanvasModal } from "@/components/library/modals/canvas/NewCanvasModal";
import { NewDocumentModal } from "@/components/library/modals/documents/NewDocumentModal";
import { NewVideoDraftModal } from "@/components/library/modals/editor/NewVideoDraftModal";
import { NewConnectedFolderModal } from "@/components/library/modals/folders/NewConnectedFolderModal";
import { NewFolderModal } from "@/components/library/modals/folders/NewFolderModal";
import { NewPhysicalAssetModal } from "@/components/library/modals/physical-assets/NewPhysicalAssetModal";
import {
  LibraryViewsPopover,
  LibraryViewsPopoverContent,
} from "@/components/library/popovers/LibraryViewsPopover";
// import { DownloadCommentMenu } from '@/components/review/download-review/DownloadCommentMenu';
// import { SearchbarButton } from '@/components/SearchbarButton';
import { StatusIcon } from "@/components/StatusIcon";
import { useLocation } from "react-router-dom";

import { useFileUpload } from "@/hooks/useFileUpload";
// import { useSearchActions, useSearchCommands } from '@/hooks/useSearch';

import {
  useDownloadMetadata,
  useUpdateFileStatus,
} from "@/api-integration/mutations/library";
import { useAssetDetailsQuery } from "@/api-integration/queries/library";
import {
  AssetDetails,
  FileStatus,
  VersionStackAssetDetails,
} from "@/api-integration/types/library";

// import { SocialMediaAccount } from '@/api-integration/types/publishing';

import { useLibraryStore } from "@/stores/library-store";

import { LibraryCommandKey } from "@/utils/searchUtils";

// import { usePreferencesStore } from '@/stores/preferences-store';
// import { SocialMedia, usePublishingStore } from '@/stores/publishing-store';

import "@/stores/publishing-store"; // SocialMedia,

import {
  // Filter,
  Grid2X2,
  Search,
} from "lucide-react";

import {
  Drawer,
  DrawerContent,
  DrawerItem,
  // DrawerNested,
  DrawerNestedItem,
  DrawerTrigger,
} from "@/components/ui/Drawer";

// import { Listbox, ListboxItem } from '@/components/ui/Listbox';

// import { ReviewDrawerContent } from '@/components/review/ReviewDrawerContent';
// import { FilterBar } from '@/components/library/filters/FilterBar';
// import { SortBar } from '@/components/library/filters/SortBar';
import { Searchbar } from "@/components/Searchbar";
// import { ShareLibraryPopover } from '@/components/share/ShareLibraryPopover';
// import { ShareLibraryPopover } from '@/components/share/ShareLibraryPopover';
// import { useDocumentExport } from '@/components/tiptap/useDocumentExport';

import { useFeatureFlag } from "@/hooks/useFeatureFlag";
// import { useLibraryFilterState } from '@/hooks/useLibraryFilterState';
import { useWorkspace } from "@/hooks/useWorkspace";

import { useUserWorkspacePermissionListQuery } from "@/api-integration/queries/user-management";

// import { useEditorStore } from '@/stores/editor-store';
// SocialMediaPlatform,
// socialMediaPlatforms,
// usePublishingStore

import { useSearchActionsStore } from "@/stores/search-actions-store";

import { checkPermission, PERMISSIONS } from "@/utils/accessUtils";
import { formatDate } from "@/utils/dates";
import { ASSET_SHARE_FLAG } from "@/utils/featureFlagUtils";
import { MOBILE_MEDIA_QUERY } from "@/utils/responsiveUtils";
import { getLabelFromFileStatus } from "@/utils/status";

import {
  FileCard,
  getResourceType,
  PhysicalAssetThumbnail,
  Thumbnail,
} from "../library/LibraryTableView";
import { ConnectedFolderTooltip } from "../library/asset/ConnectedFolderTooltip";
import { SearchbarButton } from "../SearchbarButton";

export const LibraryActionbar = () => {
  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);

  // const pathname = usePathname();
  const params = useParams() as { folderId: string; assetId: string };
  // const router = useRouter();

  // const searchParams = useSearchParams();
  // const { isDirty, setIsDirty } = useEditorStore();

  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const pathname = useLocation().pathname;

  // const isAIView = searchParams.has("isAIView");
  // const viewId = isAIView ? searchParams.get("isAIView") : null;
  // const assetId = searchParams.get("version") ?? params.assetId;

  const uploadInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile } = useFileUpload("library", params.folderId || null);

  const { data, isLoading } = useAssetDetailsQuery(
    (params.folderId as string) || (params.assetId as string)
  );

  // const onFolderPage = pathname.startsWith('/library/folder');
  // const onAssetPage = pathname.startsWith('/library/asset');
  // const onFolderMetadataPage =
  //   pathname.startsWith('/library/folder') && pathname.endsWith('/metadata');
  // const onEditorPage =
  //   pathname.startsWith('/library/video') || pathname.startsWith('/library/editor');

  const isShareEnabled = useFeatureFlag(ASSET_SHARE_FLAG);

  const { workspace } = useWorkspace();

  const { data: workspacePermissions } = useUserWorkspacePermissionListQuery(
    workspace?.id as string
  );

  // const socialMediaAccounts = queryClient.getQueryData<SocialMediaAccount[]>([
  //   'social-media-accounts'
  // ]);

  const {
    toggleFilterBar,
    toggleSortBar,
    toggleMetadataPanel,
    showFilterBar,
    showSortBar,
    view,
    setView,
  } = useLibraryStore();

  const { search, setSearch, clearFilters, clearSorts } = useLibraryStore();

  // const { setIsPreferencesModalOpen, setSelectedItem } = usePreferencesStore();

  // const {
  //   setSelectedSocialMedia,
  //   // setIsInstagramPostModalOpen,
  //   // setIsInstagramReelModalOpen,
  //   setIsYoutubeVideoModalOpen,
  //   setIsYoutubeShortsModalOpen
  // } = usePublishingStore();

  const {
    isNewConnectedFolderOpen,
    onNewFolderOpenChange,
    onNewConnectedFolderOpenChange,
    isNewFolderOpen,
    inputFileRef,
  } = useSearchActionsStore();

  const {
    isOpen: isNewPhysicalAssetModalOpen,
    onOpenChange: onNewPhysicalAssetModalOpenChange,
    onOpen: onNewPhysicalAssetModalOpen,
  } = useDisclosure();

  const {
    isOpen: isNewDocumentModalOpen,
    onOpenChange: onNewDocumentModalOpenChange,
    onOpen: onNewDocumentModalOpen,
  } = useDisclosure();

  const {
    isOpen: isNewCanvasModalOpen,
    onOpenChange: onNewCanvasModalOpenChange,
    onOpen: onNewCanvasModalOpen,
  } = useDisclosure();

  const {
    isOpen: isNewVideoDraftModalOpen,
    onOpenChange: onNewVideoDraftModalOpenChange,
    onOpen: onNewVideoDraftModalOpen,
  } = useDisclosure();

  const onFolderDropdownMenuAction = (key: Key) => {
    if (key === "new-folder") {
      onNewFolderOpenChange();
    }
    if (key === "new-connected-folder") {
      onNewConnectedFolderOpenChange();
    }
    if (key === "new-physical-asset") {
      onNewPhysicalAssetModalOpen();
    }
    if (key === "new-document") {
      onNewDocumentModalOpen();
    }
    if (key === "new-canvas") {
      onNewCanvasModalOpen();
    }
    if (key === "new-video-draft") {
      onNewVideoDraftModalOpen();
    }
  };

  const uploadFiles = () => {
    const files = uploadInputRef.current?.files;
    if (files) {
      Array.from(files).forEach((file) => uploadFile(file));
    }
    if (uploadInputRef.current) {
      uploadInputRef.current.value = "";
    }
  };

  const goBack = () => {
    if (data?.parent) {
      navigate(`/folder/${data.parent.id}`);
    } else {
      navigate(`/library`);
    }
  };

  // const goBack = () => {
  //   if (data?.parent) {
  //     router.push(`/library/folder/${data.parent.id}`);
  //   } else {
  //     router.push(`/library`);
  //   }
  // };

  const showStatusDropdown = true;

  const onFolderPage = pathname.startsWith("/folder");
  const onAssetPage = pathname.startsWith("/asset");
  const onLibraryPage =
    pathname.startsWith("/library") && !onFolderPage && !onAssetPage;

  console.log({
    onFolderPage,
    onAssetPage,
    pathname,
  });

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // const { librarySearchCommands } = useSearchCommands();

  // const { onLibraryAction } = useSearchActions();

  // useHotkeys(
  //   librarySearchCommands.map((command) => [
  //     command.kbd.join('+'),
  //     (e) => {
  //       e.preventDefault();

  //       onLibraryAction(command.key as LibraryCommandKey);
  //     }
  //   ]),
  //   [],
  //   true
  // );

  // useEffect(() => {
  //   if (data) {
  //     let filteredPlatforms = socialMediaPlatforms.filter((platform) =>
  //       platform.allowedFileTypes.includes(data.resourcetype)
  //     );

  //     if (data.resourcetype === 'ImageFile') {
  //       filteredPlatforms = filteredPlatforms.filter((platform) =>
  //         platform.allowedFileTypes.includes('ImageFile')
  //       );
  //     }

  //     if (data.resourcetype === 'VideoFile' && data.video_width && data.video_height) {
  //       const aspectRatio = data.video_width / data.video_height;
  //       filteredPlatforms = filteredPlatforms.filter((platform) => {
  //         const [width, height] = platform.aspectRatio.split(':').map(Number);
  //         const platformRatio = width / height;
  //         // Allow for some tolerance in aspect ratio comparison
  //         return (
  //           Math.abs(aspectRatio - platformRatio) < 0.1 &&
  //           platform.allowedFileTypes.includes('VideoFile')
  //         );
  //       });

  //       const otherPlatforms = socialMediaPlatforms.filter(
  //         (platform) => !filteredPlatforms.filter((p) => p.id === platform.id).length
  //       );

  //       setOtherSocialMedia(
  //         otherPlatforms.filter((p) =>
  //           p.allowedFileTypes.includes('VideoFile')
  //         ) as SocialMediaPlatform[]
  //       );
  //     }

  //     setSuggestedSocialMedia(filteredPlatforms as SocialMediaPlatform[]);
  //   }
  //   return () => {
  //     setSuggestedSocialMedia([]);
  //     setOtherSocialMedia([]);
  //   };
  // }, [data]);

  // useEffect(() => {
  //   if (pathname === '/library') {
  //     document.title = 'Library - Tessact';
  //   }
  //   if (data) {
  //     if (onFolderMetadataPage) {
  //       document.title = `${data?.name} Metadata - Tessact`;
  //     } else if (onFolderPage || onAssetPage) {
  //       document.title = `${data?.name} - Tessact`;
  //     }
  //   }
  // }, [data, pathname, onFolderPage, onAssetPage, onFolderMetadataPage]);

  // const onLibraryPage = onFolderPage || (!onEditorPage && !onFolderMetadataPage && !onAssetPage);

  if (isMobile) {
    return (
      <>
        <div className="flex w-full flex-col gap-2">
          <div className="flex min-h-10 w-max items-center gap-2 overflow-hidden pl-12">
            <div className="pointer-events-auto flex w-full">
              {(onFolderPage || onAssetPage) && (
                <Button
                  isIconOnly
                  color="secondary"
                  onPress={() => navigate(-1)}
                  aria-label="Go back"
                >
                  <ArrowLeft size={20} />
                </Button>
              )}
            </div>
          </div>
          <div className="pointer-events-auto flex min-h-10 w-full flex-col items-center">
            <div className="flex w-full items-center justify-between">
              <h3 className="flex-1 truncate font-medium">
                {onLibraryPage && !onFolderPage
                  ? "Library"
                  : isLoading
                  ? "Loading..."
                  : data?.name}
              </h3>
              <div className="flex items-center gap-2">
                {onLibraryPage && (
                  <Button
                    variant="light"
                    isIconOnly
                    onPress={() => setView(view === "list" ? "grid" : "list")}
                  >
                    {view === "list" ? (
                      <BulletList size={20} />
                    ) : (
                      <LayoutGrid2 size={20} />
                    )}
                  </Button>
                )}
                {searchParams.get("version") && (
                  <VersionPanelToggle versionStackId={params.assetId} />
                )}
                <Drawer
                  open={isMobileDrawerOpen}
                  onOpenChange={setIsMobileDrawerOpen}
                >
                  <DrawerTrigger asChild>
                    <Button isIconOnly variant="light">
                      <DotGrid1X3Horizontal size={20} />
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    {onAssetPage ? (
                      // <ReviewDrawerContent
                      //   onOpenChange={setIsMobileDrawerOpen}
                      // />
                      <div>Review Drawer Content</div>
                    ) : (
                      <LibraryMobileDrawer
                        onOpenChange={setIsMobileDrawerOpen}
                      />
                    )}
                  </DrawerContent>
                </Drawer>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // if (onFolderMetadataPage) {
  //   return (
  //     <div className="flex items-center justify-between gap-5">
  //       <div className="flex flex-1 items-center gap-2 overflow-hidden">
  //         <Button
  //           isIconOnly
  //           color="secondary"
  //           onPress={() => router.push(`/library/folder/${params.folderId}`)}
  //           aria-label="Back to folder"
  //         >
  //           <ArrowLeft size={20} />
  //         </Button>
  //         <div className="flex flex-shrink-0 items-center gap-2">
  //           {data?.resourcetype === 'Folder' && !!data?.connection_id ? (
  //             <ConnectedFolderTooltip />
  //           ) : null}
  //           <h3 className="flex-1 truncate font-medium">{isLoading ? 'Loading...' : data?.name}</h3>
  //         </div>
  //       </div>

  //       <div className="flex flex-shrink-0 items-center gap-2">
  //         <DownloadButton data={data} />
  //         <Button
  //           isIconOnly
  //           color="secondary"
  //           onPress={toggleMetadataPanel}
  //           aria-label="Toggle metadata panel"
  //         >
  //           <LayoutRight size={20} />
  //         </Button>
  //       </div>
  //     </div>
  //   );
  // }

  if (onAssetPage) {
    return (
      <div className="flex items-center justify-between gap-5">
        <div className="flex items-center gap-2 overflow-hidden">
          <Button
            isIconOnly
            color="secondary"
            onPress={() => {
              goBack();
            }}
            aria-label="Back to previous page"
          >
            <ArrowLeft size={20} />
          </Button>
          <h3 className="flex-1 truncate font-medium">
            {isLoading ? "Loading..." : data?.name}
          </h3>
        </div>
        <div className="flex flex-shrink-0 items-center gap-2">
          {searchParams.get("version") && (
            <VersionSwitcher versionStackId={params.assetId} />
          )}
          {/* {(data?.resourcetype === 'VideoFile' || data?.resourcetype === 'ImageFile') && (
            <Popover
              isOpen={isPublishPopoverOpen}
              onOpenChange={(isOpen) => setIsPublishPopoverOpen(isOpen)}
            >
              <PopoverTrigger>
                <Button color="secondary" startContent={<ArrowShareRight size={20} />}>
                  Publish
                </Button>
              </PopoverTrigger>

              <PopoverContent> */}
          {/* <div className="flex flex-col gap-1 p-2">
                  <Listbox
                    onAction={(key: Key) => {
                      setIsPublishPopoverOpen(false);
                      setSelectedSocialMedia(key as unknown as SocialMediaPlatform | null);
                      if (key === 'instagram-post') {
                        setIsInstagramPostModalOpen(true);
                        setIsPublishPopoverOpen(false);
                      } else if (key === 'instagram-reel') {
                        setIsInstagramReelModalOpen(true);
                      } else if (key === 'youtube-video') {
                        setIsYoutubeVideoModalOpen(true);
                      }
                    }}
                  >
                    <ListboxSection
                      classNames={{
                        heading: 'text-xs font-medium text-ds-menu-text-header'
                      }}
                      title="Suggested accounts"
                    >
                      {suggestedSocialMedia.map((account) => (
                        <ListboxItem
                          startContent={<account.Icon className="text-ds-text-primary" size={14} />}
                          key={account.id}
                        >
                          <div className="flex items-center gap-1">
                            <p className="text-base font-medium text-ds-text-primary">
                              {account.name}
                            </p>
                            <p className="text-sm font-medium text-ds-menu-text-secondary">
                              {'('}
                              {account.aspectRatio}
                              {')'}
                            </p>
                          </div>
                        </ListboxItem>
                      ))}
                    </ListboxSection>
                  </Listbox>
                </div> */}

          {/* {youtubeAccounts && youtubeAccounts?.length > 0 ? (
                  <div className="flex flex-col gap-1 p-2">
                    <Listbox
                      onAction={(key: Key) => {
                        setIsPublishPopoverOpen(false);
                        setSelectedSocialMedia(key as unknown as SocialMedia | null);

                        if (key === 'youtube-video') {
                          setIsYoutubeVideoModalOpen(true);
                        } else if (key === 'youtube-shorts') {
                          setIsYoutubeShortsModalOpen(true);
                        }
                      }}
                    >
                      <ListboxSection
                        classNames={{
                          heading: 'text-xs font-medium text-ds-menu-text-header'
                        }}
                        title="Supported accounts"
                      >
                        {supportedSocialMediaPlatforms.map((account) => (
                          <ListboxItem
                            startContent={
                              <account.Icon className="text-ds-text-primary" size={14} />
                            }
                            key={account.id}
                          >
                            <div className="flex items-center gap-1">
                              <p className="text-base font-medium text-ds-text-primary">
                                {account.name}
                              </p>
                              <p className="text-sm font-medium text-ds-menu-text-secondary">
                                {'('}
                                {account.aspectRatio}
                                {')'}
                              </p>
                            </div>
                          </ListboxItem>
                        ))}
                      </ListboxSection>

                      <ListboxSection
                        classNames={{
                          heading: 'text-xs font-medium text-ds-menu-text-header'
                        }}
                        title="Coming Soon"
                      >
                        {comingSoonSocialMediaPlatforms.map((account) => (
                          <ListboxItem
                            startContent={
                              <account.Icon className="text-ds-text-primary" size={14} />
                            }
                            key={account.id}
                          >
                            <div className="flex items-center gap-1">
                              <p className="text-base font-medium text-ds-text-primary">
                                {account.name}
                              </p>
                              <p className="text-sm font-medium text-ds-menu-text-secondary">
                                {'('}
                                {account.aspectRatio}
                                {')'}
                              </p>
                            </div>
                          </ListboxItem>
                        ))}
                      </ListboxSection>
                    </Listbox>

                    <Button
                      startContent={<PlusSmall />}
                      onPress={() => {
                        setIsPreferencesModalOpen(true);
                        setIsPublishPopoverOpen(false);
                        setSelectedItem('publishing');
                      }}
                    >
                      Link another account
                    </Button>
                  </div>
                ) : (
                  <div className="flex w-60 flex-col">
                    <div className="flex flex-col justify-center gap-3 p-3">
                      <div className="flex flex-col items-center">
                        <p className="text-sm font-medium text-ds-text-primary">
                          Connect an Account
                        </p>
                        <p className="text-center text-xs text-ds-text-secondary">
                          Connect social media accounts to post content onto them
                        </p>
                      </div>
                      <Button
                        onPress={() => {
                          setIsPreferencesModalOpen(true);
                          setIsPublishPopoverOpen(false);
                          setSelectedItem('publishing');
                        }}
                        size="sm"
                        startContent={<PlusSmall size={20} />}
                      >
                        Link Account
                      </Button>
                    </div>
                  </div>
                )} */}
          {/* </PopoverContent>
            </Popover>
          )} */}

          {/* <Button
            color="secondary"
            href="http://172.25.54.201/assets/rushes"
            target="_blank"
            startContent={<CainLink2 size={20} />}
            as={Link}
          >
            Hi-Res Workflow
          </Button> */}

          {showStatusDropdown && data?.file_status && (
            <StatusDropdown
              status={data?.file_status}
              assetId={params.assetId}
            />
          )}

          <DownloadButton
            data={data}
            hideAssetDownload={
              !checkPermission(
                PERMISSIONS.WORKSPACE.CAN_DOWNLOAD_ASSETS,
                workspacePermissions || []
              )
            }
          />
          {/* {isShareEnabled && <ShareLibraryPopover />} */}
          <Button
            isIconOnly
            color="secondary"
            onPress={toggleMetadataPanel}
            aria-label="Toggle metadata panel"
          >
            <LayoutRight size={20} />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <input ref={inputFileRef} type="file" hidden multiple />
      <div className="flex items-center  justify-between gap-5">
        {onFolderPage ? (
          <div className="flex items-center gap-2 overflow-hidden">
            <Button
              isIconOnly
              color="secondary"
              onPress={goBack}
              aria-label="Back to previous page"
            >
              <ArrowLeft size={20} />
            </Button>
            <div className="flex min-w-0 flex-shrink-0 items-center gap-1">
              {/* Show tooltip if folder is a connected folder */}
              {data?.resourcetype === "Folder" && !!data?.connection_id ? (
                <ConnectedFolderTooltip />
              ) : null}
              <h3 className="min-w-0 flex-1 truncate font-medium">
                {isLoading ? "Loading..." : data?.name}
              </h3>
            </div>
          </div>
        ) : (
          <h3 className="font-medium">Library</h3>
        )}
        <div className="flex flex-shrink-0 items-center gap-2">
          <SearchbarButton
            value={search}
            onChange={setSearch}
            placeholder="Search inside folder"
          />
          <Button
            isIconOnly
            color="secondary"
            className={cn(
              "px-6",
              showFilterBar && "bg-ds-button-secondary-bg-hover"
            )}
            onPress={() => {
              if (showFilterBar) clearFilters();
              toggleFilterBar();
            }}
            aria-label="Filter on library"
          >
            <span className="inline-block">
              <Filter2 size={20} />
            </span>
          </Button>
          <Button
            isIconOnly
            color="secondary"
            className={cn(
              "px-6",
              showSortBar && "bg-ds-button-secondary-bg-hover"
            )}
            onPress={() => {
              if (showSortBar) clearSorts();
              toggleSortBar();
            }}
            aria-label="Sort on library"
          >
            <span className="inline-block">
              <ArrowTopBottom size={20} />
            </span>
          </Button>
          {onFolderPage && (
            <Button
              as={Link}
              href={`/library/folder/${params.folderId}/metadata`}
              isIconOnly
              color="secondary"
              aria-label="View library metadata"
            >
              <CircleInfo size={20} />
            </Button>
          )}
          <LibraryViewsPopover />
          {(!onFolderPage || data?.permissions.includes("can_edit_asset")) && (
            // Allow new and upload action only if user has folder edit permission
            <>
              <Divider orientation="vertical" className="mx-2 h-4" />
              <ButtonGroup>
                <Button
                  isIconOnly
                  color="secondary"
                  className="px-7"
                  onPress={() => onNewFolderOpenChange()}
                  aria-label="New folder on library"
                >
                  <span className="inline-block">
                    <FolderAdd size={20} />
                  </span>
                </Button>
                <Dropdown placement="bottom-end">
                  <DropdownTrigger>
                    <Button
                      isIconOnly
                      color="secondary"
                      className="border-l border-background-50"
                      aria-label="New folder on library"
                    >
                      <ChevronDownSmall size={20} />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu onAction={onFolderDropdownMenuAction}>
                    <DropdownSection showDivider className="mb-0">
                      <DropdownItem key="new-folder">New folder</DropdownItem>
                      <DropdownItem key="new-connected-folder">
                        New connected folder
                      </DropdownItem>
                    </DropdownSection>
                    <DropdownSection>
                      <DropdownItem key="new-physical-asset">
                        New physical asset
                      </DropdownItem>
                      <DropdownItem key="new-document">
                        New document
                      </DropdownItem>
                      <DropdownItem key="new-canvas">New canvas</DropdownItem>
                      <DropdownItem key="new-video-draft">
                        New video draft
                      </DropdownItem>
                    </DropdownSection>
                  </DropdownMenu>
                </Dropdown>
              </ButtonGroup>

              <input
                type="file"
                ref={uploadInputRef}
                multiple
                onChange={uploadFiles}
                hidden
              />
              <Button
                color="primary"
                startContent={<CloudUpload size={20} />}
                onPress={() => uploadInputRef.current?.click()}
                aria-label="Upload on library"
              >
                Upload
              </Button>
            </>
          )}
        </div>
      </div>
      <NewFolderModal
        isOpen={isNewFolderOpen}
        onOpenChange={onNewFolderOpenChange}
      />
      <NewConnectedFolderModal
        isOpen={isNewConnectedFolderOpen}
        onOpenChange={onNewConnectedFolderOpenChange}
      />
      <NewPhysicalAssetModal
        isOpen={isNewPhysicalAssetModalOpen}
        onOpenChange={onNewPhysicalAssetModalOpenChange}
      />
      <NewDocumentModal
        isOpen={isNewDocumentModalOpen}
        onOpenChange={onNewDocumentModalOpenChange}
      />
      <NewCanvasModal
        isOpen={isNewCanvasModalOpen}
        onOpenChange={onNewCanvasModalOpenChange}
      />
      <NewVideoDraftModal
        isOpen={isNewVideoDraftModalOpen}
        onOpenChange={onNewVideoDraftModalOpenChange}
      />
    </>
  );
};

const getLabelFromResourceType = (
  resourcetype: AssetDetails["resourcetype"]
) => {
  if (resourcetype === "VideoFile") return "video";
  if (resourcetype === "AudioFile") return "audio";
  if (resourcetype === "ImageFile") return "image";
  if (resourcetype === "File") return "file";
  return "file";
};

const DownloadButton = ({
  data,
  hideAssetDownload,
}: {
  data: AssetDetails | undefined;
  hideAssetDownload?: boolean;
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { mutate: downloadMetadata } = useDownloadMetadata(data?.id || "");

  const downloadAsset = () => {
    if (
      data?.resourcetype !== "Folder" &&
      data?.resourcetype !== "PhysicalAsset" &&
      data?.resourcetype !== "VersionStack"
    ) {
      window.open(data?.url || "");
    }
  };

  if (!data) return null;

  if (data.resourcetype === "File" && data.file_extension === ".tboard") {
    return (
      <RadixDropdownMenu open={isOpen} onOpenChange={onOpenChange}>
        <RadixDropdownMenuTrigger asChild>
          <Button
            onPress={onOpen}
            color="secondary"
            aria-label="Download on library"
            isIconOnly
          >
            <ArrowInbox size={20} />
          </Button>
        </RadixDropdownMenuTrigger>
        <RadixDropdownMenuContent align="end">
          {/* {!hideAssetDownload && (
            <RadixDropdownMenuItem onSelect={() => triggerCanvasExport()}>
              Download canvas
            </RadixDropdownMenuItem>
          )} */}
          <RadixDropdownMenuItem onSelect={() => downloadMetadata()}>
            Download metadata
          </RadixDropdownMenuItem>
          <RadixDropdownMenuSub>
            <RadixDropdownMenuSubTrigger
              endContent={<ChevronRightSmallFilled width={20} height={20} />}
            >
              Download comments
            </RadixDropdownMenuSubTrigger>
            <RadixDropdownMenuPortal>
              <RadixDropdownMenuSubContent className="max-h-96 overflow-y-auto">
                {/* <DownloadCommentMenu fileId={data?.id} fileName={data?.name} /> */}
              </RadixDropdownMenuSubContent>
            </RadixDropdownMenuPortal>
          </RadixDropdownMenuSub>
        </RadixDropdownMenuContent>
      </RadixDropdownMenu>
    );
  }

  if (data.resourcetype === "File" && data.file_extension === ".tscript") {
    return (
      <RadixDropdownMenu open={isOpen} onOpenChange={onOpenChange}>
        <RadixDropdownMenuTrigger asChild>
          <Button
            onPress={onOpen}
            color="secondary"
            aria-label="Download on library"
            isIconOnly
          >
            <ArrowInbox size={20} />
          </Button>
        </RadixDropdownMenuTrigger>
        <RadixDropdownMenuContent align="end">
          {/* {!hideAssetDownload && (
            <RadixDropdownMenuItem onSelect={() => triggerDocumentExport()}>
              Download document
            </RadixDropdownMenuItem>
          )} */}
          <RadixDropdownMenuItem onSelect={() => downloadMetadata()}>
            Download metadata
          </RadixDropdownMenuItem>
          <RadixDropdownMenuSub>
            <RadixDropdownMenuSubTrigger
              endContent={<ChevronRightSmallFilled width={20} height={20} />}
            >
              Download comments
            </RadixDropdownMenuSubTrigger>
            {/* <RadixDropdownMenuPortal>
              <RadixDropdownMenuSubContent className="max-h-96 overflow-y-auto">
                <DownloadCommentMenu fileId={data?.id} fileName={data?.name} />
              </RadixDropdownMenuSubContent>
            </RadixDropdownMenuPortal> */}
          </RadixDropdownMenuSub>
        </RadixDropdownMenuContent>
      </RadixDropdownMenu>
    );
  }

  if (
    data.resourcetype === "VideoFile" ||
    data.resourcetype === "AudioFile" ||
    data.resourcetype === "ImageFile" ||
    (data.resourcetype === "File" &&
      data.file_extension !== ".tdraft" &&
      data.file_extension !== ".tboard" &&
      data.file_extension !== ".tscript")
  ) {
    return (
      <RadixDropdownMenu open={isOpen} onOpenChange={onOpenChange}>
        <RadixDropdownMenuTrigger asChild>
          <Button
            onPress={onOpen}
            color="secondary"
            aria-label="Download on library"
            isIconOnly
          >
            <ArrowInbox size={20} />
            {/* <ChevronDownSmall size={20} /> */}
          </Button>
        </RadixDropdownMenuTrigger>
        <RadixDropdownMenuContent align="end">
          {!hideAssetDownload && (
            <RadixDropdownMenuItem onSelect={() => downloadAsset()}>
              Download {getLabelFromResourceType(data.resourcetype)}
            </RadixDropdownMenuItem>
          )}
          <RadixDropdownMenuItem onSelect={() => downloadMetadata()}>
            Download metadata
          </RadixDropdownMenuItem>
          <RadixDropdownMenuSub>
            <RadixDropdownMenuSubTrigger
              endContent={<ChevronRightSmallFilled width={20} height={20} />}
            >
              Download comments
            </RadixDropdownMenuSubTrigger>
            {/* <RadixDropdownMenuPortal>
              <RadixDropdownMenuSubContent className="max-h-96 overflow-y-auto">
                <DownloadCommentMenu fileId={data?.id} fileName={data?.name} />
              </RadixDropdownMenuSubContent>
            </RadixDropdownMenuPortal> */}
          </RadixDropdownMenuSub>
        </RadixDropdownMenuContent>
      </RadixDropdownMenu>
    );
  }

  if (data.resourcetype === "Folder" || data.resourcetype === "PhysicalAsset") {
    return (
      <Button
        color="primary"
        startContent={<FileDownload size={20} />}
        onPress={() => downloadMetadata()}
        aria-label="Download metadata on library"
      >
        Download Metadata
      </Button>
    );
  }
};

const StatusDropdown = ({
  status,
  assetId,
}: {
  status: FileStatus;
  assetId: string;
}) => {
  const [currentStatus, setCurrentStatus] = useState<FileStatus>(status);

  useEffect(() => {
    setCurrentStatus(status);
  }, [status]);

  const { mutate } = useUpdateFileStatus(assetId);

  const { isReviewStatusDropdownOpen, onReviewStatusDropdownOpenChange } =
    useSearchActionsStore();

  return (
    <Dropdown
      onOpenChange={onReviewStatusDropdownOpenChange}
      isOpen={isReviewStatusDropdownOpen}
      placement="bottom-start"
    >
      <DropdownTrigger>
        <Button
          color="secondary"
          startContent={<StatusIcon status={currentStatus} />}
          endContent={<ChevronDownSmall className="h-4 w-4" />}
          aria-label="Status dropdown on library"
        >
          {getLabelFromFileStatus(currentStatus)}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        onAction={(key) => {
          if (key === currentStatus) return;

          mutate(key as FileStatus, {
            onError: () => {
              setCurrentStatus(status);
            },
          });
          setCurrentStatus(key as FileStatus);
        }}
      >
        <DropdownItem
          key="not_started"
          startContent={<StatusIcon status="not_started" />}
        >
          Not started
        </DropdownItem>
        <DropdownItem
          key="needs_edit"
          startContent={<StatusIcon status="needs_edit" />}
        >
          Needs edit
        </DropdownItem>
        {/* <DropdownItem key="processed" startContent={<StatusIcon status="processed" />}>
          Processed
        </DropdownItem> */}
        <DropdownItem
          key="in_progress"
          startContent={<StatusIcon status="in_progress" />}
        >
          In progress
        </DropdownItem>
        <DropdownItem
          key="approved"
          startContent={<StatusIcon status="approved" />}
        >
          Approved
        </DropdownItem>
        <DropdownItem
          key="rejected"
          startContent={<StatusIcon status="rejected" />}
        >
          Rejected
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

const VersionSwitcher = ({ versionStackId }: { versionStackId: string }) => {
  const { data, isLoading } = useAssetDetailsQuery(versionStackId);

  const versionStack = data as VersionStackAssetDetails;

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const assetId = searchParams.get("version") ?? "";

  if (!assetId || !versionStack) {
    return null;
  }

  const selectedVersion = versionStack.versions.find(
    (v) => v.file.id === assetId
  );

  if (!selectedVersion) {
    return null;
  }

  const handleVersionSelection = (key: Key) => {
    const clickedVersion = versionStack?.versions?.find(
      (v) => v.file.id === key
    );

    const fileId = key as string;
    const params = new URLSearchParams(searchParams);
    params.set("version", fileId);

    if (
      clickedVersion?.file?.resourcetype === "File" &&
      clickedVersion?.file?.file_extension === ".tdraft"
    ) {
      navigate(`/library/video/${versionStack?.id}?${params.toString()}`, {
        replace: true,
      });
    } else {
      navigate(`/library/asset/${versionStack?.id}?${params.toString()}`, {
        replace: true,
      });
    }
  };

  if (isLoading || !versionStack) return null;

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Button
          color="secondary"
          endContent={<ChevronDownSmall className="h-4 w-4" />}
          aria-label="Version switcher on library"
        >
          v{selectedVersion.version_number}
        </Button>
      </DropdownTrigger>

      <DropdownMenu onAction={handleVersionSelection}>
        {versionStack.versions.map((version, index) => {
          const isEditorDraft =
            version.file.resourcetype === "File" &&
            version.file.file_extension === ".tdraft";
          const isDocument =
            version.file.resourcetype === "File" &&
            version.file.file_extension === ".tscript";
          const isCanvas =
            version.file.resourcetype === "File" &&
            version.file.file_extension === ".tboard";

          return (
            <DropdownItem
              key={version.file.id}
              startContent={
                <div
                  key={version.id}
                  className="flex h-16 min-w-0 items-center justify-center"
                >
                  <div
                    key={index}
                    className="flex h-6 w-8 min-w-0 items-center justify-center rounded-lg bg-default-200 px-1 font-medium text-ds-text-primary focus:outline-none"
                  >
                    v{versionStack.versions.length - index}
                  </div>
                </div>
              }
            >
              <div className="flex min-w-0 max-w-xs items-start gap-2">
                <div className="aspect-video h-10 flex-shrink-0 ">
                  {version.file.resourcetype === "VideoFile" ||
                  version.file.resourcetype === "ImageFile" ? (
                    <Thumbnail
                      fileName={version.file.name}
                      thumbnailUrl={version.file.thumbnail || ""}
                    />
                  ) : version.file.resourcetype === "PhysicalAsset" ? (
                    <PhysicalAssetThumbnail
                      barcode={version.file.barcode}
                      thumbnailUrl={version.file.asset_image || ""}
                    />
                  ) : (
                    <FileCard fileExtension={version.file.file_extension} />
                  )}
                </div>
                <div className="flex min-w-0 flex-col overflow-hidden whitespace-nowrap">
                  <Tooltip
                    showArrow={true}
                    delay={500}
                    closeDelay={0}
                    content={<span>{version.file.name}</span>}
                    classNames={{
                      content: "p-2",
                    }}
                  >
                    <h3 className="min-w-0 truncate">{version.file.name}</h3>
                  </Tooltip>

                  <div className="flex items-center gap-2">
                    <p className="text-xs text-ds-text-secondary">
                      {version.file.resourcetype === "File" ? (
                        <>
                          {isDocument
                            ? "Document"
                            : isCanvas
                            ? "Canvas"
                            : isEditorDraft
                            ? "Video Draft"
                            : prettyBytes(version.file.size)}
                        </>
                      ) : (
                        getResourceType(version.file.resourcetype, false)
                      )}
                    </p>
                    <Divider orientation="vertical" className="h-2" />
                    <p className="text-xs text-ds-text-secondary">
                      uploaded {formatDate(version.file.created_on)}
                    </p>
                  </div>
                </div>
              </div>
            </DropdownItem>
          );
        })}
      </DropdownMenu>
    </Dropdown>
  );
};

const VersionPanelToggle = ({ versionStackId }: { versionStackId: string }) => {
  const { data, isLoading } = useAssetDetailsQuery(versionStackId);

  const [searchParams] = useSearchParams();

  const { showVersionsPanel, toggleVersionsPanel } = useLibraryStore();

  if (isLoading || !data || data?.resourcetype !== "VersionStack") return null;
  const selectedVersion = data.versions.find(
    (v) => v.file.id === searchParams.get("version")
  );

  return (
    <Button
      variant="flat"
      onPress={() => toggleVersionsPanel()}
      size="sm"
      className="text-base font-medium"
      endContent={
        <ChevronDownSmall
          className={cn(
            "h-4 w-4 transition",
            showVersionsPanel && "-rotate-180"
          )}
        />
      }
    >
      v{selectedVersion?.version_number}
    </Button>
  );
};

const LibraryMobileDrawer = ({
  onOpenChange,
}: {
  onOpenChange: (open: boolean) => void;
}) => {
  const params = useParams() as { folderId: string; assetId: string };
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile } = useFileUpload("library", params.folderId || null);

  const uploadFiles = () => {
    const files = uploadInputRef.current?.files;
    if (files) {
      Array.from(files).forEach((file) => uploadFile(file));
    }
    if (uploadInputRef.current) {
      uploadInputRef.current.value = "";
    }
    // const drawerWrapper = document.querySelector('[data-vaul-drawer-wrapper]') as HTMLElement;
    // drawerWrapper?.click();
    onOpenChange(false);
  };

  return (
    <div className="flex w-full  flex-col gap-1.5">
      {/* <DrawerNestedItem
        label="New"
        icon={<PlusCircle size={20} className="text-default-500" />}
        drawerContent={<LibraryDrawerNewContent />}
      /> */}
      <DrawerNestedItem
        label="View"
        icon={<Grid2X2 size={20} className="text-default-500" />}
        drawerContent={<LibraryViewsPopoverContent />}
      />
      <DrawerNestedItem
        label="Search"
        icon={<Search size={20} className="text-default-500" />}
        drawerContent={<LibraryMobileSearchbar />}
      />
      {/* <DrawerNestedItem
        label="Filter"
        icon={<Filter size={20} className="text-default-500" />}
        drawerContent={<FilterBar key="filter-bar" />}
      /> */}
      {/* <DrawerNestedItem
        label="Sort"
        icon={<FilterTimeline size={20} className="text-default-500" />}
        drawerContent={<SortBar key="sort-bar" />}
      /> */}
      <DrawerItem
        label="Upload"
        icon={<CloudUpload size={20} className="text-default-500" />}
        onClick={() => uploadInputRef.current?.click()}
      />
      <input
        type="file"
        ref={uploadInputRef}
        multiple
        onChange={uploadFiles}
        hidden
      />
    </div>
  );
};

const LibraryMobileSearchbar = () => {
  const { search, setSearch } = useLibraryStore();

  return (
    <Searchbar
      placeholder="Search inside folder"
      value={search}
      onValueChange={setSearch}
    />
  );
};
