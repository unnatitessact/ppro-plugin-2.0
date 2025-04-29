// "use client";

// import {
//   Suspense,
//   useCallback,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from "react";

// // import dynamic from 'next/dynamic';
// // import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';

// import {
//   useParams,
//   useLocation,
//   useNavigate,
//   useSearchParams,
// } from "react-router-dom";

// // import { useAuth } from '@/context/auth';
// import useAuth from "@/hooks/useAuth";
// import { CommentsProvider } from "@/context/comments";
// import { DetectionProvider } from "@/context/detection";
// import { usePermissions } from "@/context/permissions";
// import { PlayerContextProvider } from "@/context/player";
// import {
//   LiveShapePreview,
//   RoomProvider,
//   useEventListener,
// } from "../../../liveblocks.config";
// import {
//   useHotkeys,
//   useMediaQuery,
//   //  useIdle
// } from "@mantine/hooks";
// import { cn, Image, Spinner } from "@nextui-org/react";
// import { useQueryClient } from "@tanstack/react-query";
// import { AnimatePresence, motion } from "framer-motion";
// import { Panel, PanelGroup } from "react-resizable-panels";

// import {
//   BubbleText6,
//   CircleInfo,
//   Lock,
//   // MagicWand2,
//   Server,
// } from "@tessact/icons";

// import { CurvedTabs } from "@/components/ui/curved-tabs/CurvedTabs";
// import { Tab, Tabs } from "@/components/ui/Tabs";

// import { Access } from "@/components/library/access/Access";
// import { PanelResizeHandle } from "@/components/PanelResizeHandle";
// import { AssetRemixBar } from "@/components/remixes-bar/AssetRemixBar";
// import { ReviewHotkeys } from "@/components/review/hotkeys/ReviewHotkeys";
// import { defaultShape } from "@/components/review/markers-canvas/shapes";
// import { VersionSelectorLibrary } from "@/components/review/VersionSelectorLibrary";

// import { useApi } from "@/hooks/useApi";
// import { useFeatureFlag } from "@/hooks/useFeatureFlag";
// import { useSearchActions, useSearchCommands } from "@/hooks/useSearch";

// import { useAssetDetailsQuery } from "@/api-integration/queries/library";
// import { getMetadataFieldsForAllCategoriesQueryKey } from "@/api-integration/queries/metadata";
// import {
//   AIEditResponse,
//   AudioAIEdit,
//   VideoAIEdit,
// } from "@/api-integration/types/editor";
// import { AssetDetails, SpriteSheet } from "@/api-integration/types/library";

// import { useAIUtilsStore } from "@/stores/ai-utils-store";
// import { useLibraryStore, VideoTab } from "@/stores/library-store";
// import { useReviewStore } from "@/stores/review-store";
// import {
//   AssetPageTab,
//   useSearchActionsStore,
// } from "@/stores/search-actions-store";

// import { checkPermission, PERMISSIONS } from "@/utils/accessUtils";
// import { REMIXES_FLAG } from "@/utils/featureFlagUtils";
// import { MOBILE_MEDIA_QUERY } from "@/utils/responsiveUtils";
// import { roomPrefixes } from "@/utils/roomUtils";
// // import { TESSACT_AI_FLAG } from '@/utils/featureFlagUtils';
// import { ReviewCommandKey } from "@/utils/searchUtils";
// import LibraryLayout from "@/components/layout/LibraryLayout";

// // const DetectionPanel = dynamic(
// //   async () =>
// //     (await import("@/components/detection/DetectionPanel")).DetectionPanel,
// //   { ssr: false }
// // );
// const CommentPanel = dynamic(
//   async () => (await import("@/components/library/CommentPanel")).default,
//   { ssr: false }
// );
// const FilePreview = dynamic(
//   async () =>
//     (await import("@/components/library/metadata/FilePreview")).FilePreview,
//   { ssr: false }
// );
// const PhysicalAssetPreview = dynamic(
//   async () =>
//     (await import("@/components/library/metadata/PhysicalAssetPreview"))
//       .PhysicalAssetPreview,
//   { ssr: false }
// );
// const TechnicalMetadata = dynamic(
//   async () =>
//     (await import("@/components/library/metadata/TechnicalMetadata"))
//       .TechnicalMetadata,
//   { ssr: false }
// );
// const MetadataPanel = dynamic(
//   async () => (await import("@/components/library/MetadataPanel")).default,
//   { ssr: false }
// );

// // const AIPrompts = dynamic(
// //   async () => (await import('@/components/library/ai/AIPrompts')).AIPrompts,
// //   { ssr: false }
// // );
// // const EditorComposition = dynamic(
// //   async () =>
// //     (await import("@/components/library/ai/EditorComposition"))
// //       .EditorComposition,
// //   {
// //     ssr: false,
// //   }
// // );
// const AudioPlayer = dynamic(
//   async () => (await import("@/components/library/AudioPlayer")).AudioPlayer,
//   {
//     ssr: false,
//   }
// );

// const VideoAssetPlayer = dynamic(
//   async () => (await import("@/components/library/VideoAssetPlayer")).default,
//   {
//     ssr: false,
//   }
// );

// // const DocEditor = dynamic(
// //   async () => (await import("@/components/tiptap/DocEditor")).DocEditor,
// //   {
// //     ssr: false,
// //   }
// // );

// // const ExcalidrawCanvas = dynamic(
// //   async () =>
// //     (await import("@/components/excalidraw/ExcalidrawCanvas")).ExcalidrawCanvas,
// //   {
// //     ssr: false,
// //   }
// // );

// const AssetPage = ({ initialData }: { initialData: AssetDetails }) => {
//   // If this is a version stack, we select a version

//   const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);

//   const { assetId: fileId } = useParams() as { assetId: string };
//   const { data: fileData, isLoading: isLoadingFileData } = useAssetDetailsQuery(
//     fileId as string,
//     {
//       initialData,
//     }
//   );

//   const searchParams = useSearchParams();
//   const assetId = searchParams.get("version") ?? fileId;

//   const router = useRouter();
//   const pathname = usePathname();
//   const api = useApi();

//   const { data, isLoading } = useAssetDetailsQuery(assetId as string, {
//     enabled: !!assetId,
//   });

//   const { organizationPermissions } = usePermissions();

//   // const isTessactAIEnabled = useFeatureFlag(TESSACT_AI_FLAG);

//   // const searchParams = useSearchParams();

//   // const versionFileId = searchParams?.get('version');

//   const [selectedTab, setSelectedTab] = useState<"preview" | "metadata">(
//     "preview"
//   );

//   const [isDetectionOpen, setIsDetectionOpen] = useState(false);

//   // const isIdle = useIdle(3000, { initialState: false });

//   const {
//     showMetadataPanel,
//     selectedVideoTab,
//     setSelectedVideoTab,
//     compositionToPreview,
//     setCompositionToPreview,
//   } = useLibraryStore();

//   const showSidepanel = showMetadataPanel && !isMobile;

//   useEffect(() => {
//     setSelectedVideoTab("original");
//     setCompositionToPreview([]);
//   }, [assetId, setSelectedVideoTab, setCompositionToPreview]);

//   useEffect(() => {
//     return () => {
//       setSelectedVideoTab("original");
//       setCompositionToPreview([]);
//     };
//   }, [setSelectedVideoTab, setCompositionToPreview]);

//   const { onReviewAction } = useSearchActions();

//   const { setSelectedPanelTab, selectedPanelTab } = useSearchActionsStore();

//   const isLibraryCommentsEnabled = true;

//   const onAssetPage = pathname.startsWith("/library/asset");

//   // const isVideoFile =
//   //   data?.resourcetype === 'VideoFile' ||
//   //   (data?.resourcetype === 'VersionStack' &&
//   //     data?.versions?.[0]?.file?.resourcetype === 'VideoFile');

//   // useEffect(() => {
//   //   if (isVideoFile) {
//   //     setSelectedPanelTab('ai');
//   //   } else {
//   //     setSelectedPanelTab('metadata');
//   //   }
//   // }, [isVideoFile, setSelectedPanelTab]);

//   useEffect(() => {
//     if (!isLoadingFileData && fileData && onAssetPage) {
//       const params = new URLSearchParams(searchParams);
//       const versionFileId = searchParams.get("version");
//       if (fileData?.resourcetype === "VersionStack" && !versionFileId) {
//         params.set("version", fileData?.versions?.[0].file.id);
//       }

//       router.replace(`${pathname}?${params.toString()}`);
//     }
//   }, [
//     fileData?.resourcetype,
//     isLoading,
//     fileData,
//     isLoadingFileData,
//     pathname,
//     router,
//     searchParams,
//     onAssetPage,
//   ]);

//   // const [selectedPanelTab, setSelectedPanelTab] = useState<'comments' | 'metadata'>(
//   //   isLibraryCommentsEnabled ? 'comments' : 'metadata'
//   // );

//   // INFO: COMMENTED FOR TESTING DETECTION
//   // useEffect(() => {
//   //   if (isLibraryCommentsEnabled) {
//   //     setSelectedPanelTab('detecto')
//   //   }
//   // }, [isLibraryCommentsEnabled, setSelectedPanelTab]);

//   const isRemixesEnabled = useFeatureFlag(REMIXES_FLAG);

//   const spriteSheetCache = useRef(new Map<string, SpriteSheet>());

//   const getSpriteSheet = useCallback(async (videoId: string) => {
//     if (spriteSheetCache.current.has(videoId)) {
//       return spriteSheetCache.current.get(videoId);
//     }
//     const { data } = await api.get<SpriteSheet>(
//       `/api/v1/library/${videoId}/sprite_sheet`
//     );
//     spriteSheetCache.current.set(videoId, data);
//     return data;
//   }, []);

//   const [processedComposition, setProcessedComposition] =
//     useState<AIEditResponse>([]);

//   useEffect(() => {
//     let mounted = true;

//     const processComposition = async () => {
//       try {
//         let currentTime = 0;
//         let currentAudioTime = 0;

//         if (
//           compositionToPreview.length === 0 ||
//           !data ||
//           data.resourcetype !== "VideoFile"
//         ) {
//           if (mounted) {
//             setProcessedComposition([]);
//           }
//           return;
//         }

//         // Process video clips sequentially to leverage cache
//         const videoClips: VideoAIEdit[] = [];
//         const videoItems = compositionToPreview.filter(
//           (clip) => clip.type === "video"
//         );

//         for (const clip of videoItems) {
//           let spriteSheet: SpriteSheet | undefined;

//           // Check cache first
//           try {
//             spriteSheet = spriteSheetCache.current.get(data.id);

//             if (!spriteSheet) {
//               spriteSheet = await getSpriteSheet(data.id);
//               if (spriteSheet) {
//                 spriteSheetCache.current.set(data.id, spriteSheet);
//               }
//             }
//           } catch {
//             console.error("Error getting sprite sheet for video", data.id);
//           }

//           const clipDuration = clip.end_time - clip.start_time;
//           const compositionClip: VideoAIEdit = {
//             video_id: data.id,
//             start_time: clip.start_time,
//             end_time: clip.end_time,
//             timeline_position: currentTime,
//             type: "video",
//             src: clip.url,
//             sprite_sheet: spriteSheet?.sprite_sheet || "",
//             sprite_width: spriteSheet?.frame_width || 0,
//             sprite_height: spriteSheet?.frame_height || 0,
//             sprite_rows: spriteSheet?.rows || 0,
//             sprite_columns: spriteSheet?.columns || 0,
//             number_of_sprites: spriteSheet?.number_of_frames || 0,
//             speed: clip.speed ?? 1,
//             volume: clip.volume ?? 1,
//           };
//           currentTime += clipDuration;
//           videoClips.push(compositionClip);
//         }

//         // Process other clips (these don't need async operations)
//         const textClips = compositionToPreview
//           .filter((clip) => clip.type === "text")
//           .map((clip) => ({
//             type: "text" as const,
//             text: clip.text || "",
//             timeline_position: clip.start_time,
//             start_time: clip.start_time,
//             end_time: clip.end_time,
//             isTitleOverlay: clip.isTitleOverlay,
//             titleOverlayProperties: clip.titleOverlayProperties,
//           }));

//         const subtitleClips = compositionToPreview
//           .filter((clip) => clip.type === "subtitle")
//           .map((clip) => ({
//             type: "subtitle" as const,
//             text: clip.text || "",
//             timeline_position: clip.start_time,
//             start_time: clip.start_time,
//             end_time: clip.end_time,
//           }));

//         const graphicClips = compositionToPreview
//           .filter((clip) => clip.type === "graphic")
//           .map((clip) => ({
//             type: "graphic" as const,
//             id: clip.id,
//             x: clip.x,
//             y: clip.y,
//             url: clip.url,
//             start_time: clip.start_time,
//             end_time: clip.end_time,
//             timeline_position: clip.start_time,
//             scale: clip.scale,
//           }));

//         const audioClips = compositionToPreview
//           .filter((clip) => clip.type === "audio")
//           .map((clip) => {
//             const clipDuration = clip.end_time - clip.start_time;
//             const compositionClip: AudioAIEdit = {
//               type: "audio" as const,
//               id: clip.id,
//               name: clip.title,
//               url: clip.url,
//               start_time: clip.start_time,
//               end_time: clip.end_time,
//               timeline_position: currentAudioTime,
//               speed: clip.speed ?? 1,
//               volume: clip.volume ?? 1,
//             };
//             currentAudioTime += clipDuration;
//             return compositionClip;
//           });

//         const codeClips = compositionToPreview
//           .filter((clip) => clip.type === "code")
//           .map((clip) => ({
//             type: "code" as const,
//             code: clip.code || "",
//             timeline_position: clip.start_time,
//             start_time: clip.start_time,
//             end_time: clip.end_time,
//           }));

//         if (mounted) {
//           setProcessedComposition([
//             ...videoClips,
//             ...textClips,
//             ...subtitleClips,
//             ...graphicClips,
//             ...audioClips,
//             ...codeClips,
//           ]);
//         }
//       } catch (error) {
//         console.error("Error processing composition:", error);
//         if (mounted) {
//           setProcessedComposition([]);
//         }
//       }
//     };

//     processComposition();

//     return () => {
//       mounted = false;
//     };
//   }, [compositionToPreview, data, getSpriteSheet]);

//   const { reviewSearchCommands } = useSearchCommands();

//   useHotkeys(
//     reviewSearchCommands.map((command) => [
//       command.kbd?.join("+"),
//       (e) => {
//         e.preventDefault();
//         onReviewAction(command.key as ReviewCommandKey);
//       },
//     ])
//   );

//   useHotkeys([["c", () => {}]]);

//   // const onCommentsTab = selectedPanelTab === 'comments';

//   const isDoc =
//     data?.resourcetype === "File" && data.file_extension === ".tscript";
//   const isCanvas =
//     data?.resourcetype === "File" && data.file_extension === ".tboard";
//   const isDraft =
//     data?.resourcetype === "File" && data.file_extension === ".tdraft";

//   const showComments =
//     isLibraryCommentsEnabled && data?.resourcetype !== "PhysicalAsset";

//   useEffect(() => {
//     if (!showComments && selectedPanelTab === "comments") {
//       setSelectedPanelTab("metadata");
//     }
//   }, [showComments, selectedPanelTab]);

//   const { reset } = useAIUtilsStore();

//   useEffect(() => {
//     return () => {
//       reset();
//       setCompositionToPreview([]);
//     };
//   }, [reset, setCompositionToPreview]);

//   const queryClient = useQueryClient();

//   useEventListener(({ event }) => {
//     if (event.type === "METADATA_UPDATED") {
//       queryClient.invalidateQueries({
//         queryKey: getMetadataFieldsForAllCategoriesQueryKey(),
//       });
//     }
//   });

//   const hasSecurityGroupPermission = useMemo(() => {
//     return checkPermission(
//       PERMISSIONS.ORGANIZATION
//         .CAN_MANAGE_SECURITY_GROUPS_PERMISSIONS_TO_CONTENT_ACROSS_WORKSPACES,
//       organizationPermissions ?? []
//     );
//   }, [organizationPermissions]);

//   if (!data || !assetId) return null;

//   const getAssetPreview = () => {
//     switch (data?.resourcetype) {
//       case "VideoFile":
//         return selectedVideoTab === "original" ? (
//           <Suspense fallback={<Spinner />}>
//             <VideoAssetPlayer
//               assetId={data?.id}
//               isConnectedFolderAsset={!!data?.connection_id}
//               src={data.playlist_file ? data.playlist_file : data.url}
//               isHLSReady={data.playlist_file ? true : false}
//               fps={data?.frame_rate ?? 24}
//               isReviewTab={
//                 selectedPanelTab === "comments" && !!isLibraryCommentsEnabled
//               }
//               isDetectionTab={isDetectionOpen}
//               scrub={{
//                 url: data.scrub_url ?? "",
//                 width: data.scrub_width,
//                 height: data.scrub_height,
//               }}
//               resolution={{
//                 width: data?.video_width,
//                 height: data?.video_height,
//               }}
//               clipStartTime={data?.start_time}
//               clipEndTime={data?.end_time}
//               duration={data?.duration}
//               fileExtension={data?.file_extension}
//             />
//           </Suspense>
//         ) : (
//           <Suspense fallback={<Spinner />}>
//             {/* <EditorComposition
//               composition={processedComposition}
//               videoWidth={data.video_width}
//               videoHeight={data.video_height}
//               fileName={data.name}
//             /> */}
//           </Suspense>
//         );
//       case "ImageFile":
//         return (
//           <Suspense fallback={<Spinner />}>
//             <Image
//               alt={data.name}
//               src={data.url}
//               classNames={{
//                 wrapper: "h-full w-full",
//                 img: "h-full w-full object-contain rounded-none",
//               }}
//             />
//           </Suspense>
//         );
//       case "PhysicalAsset":
//         return (
//           <Suspense fallback={<Spinner />}>
//             <PhysicalAssetPreview asset={data} />
//           </Suspense>
//         );
//         // case "File":
//         //   if (isCanvas)
//         //     return (
//         //       <Suspense fallback={<Spinner />}>
//         //         <ExcalidrawCanvas canvasId={assetId} />
//         //       </Suspense>
//         //     );
//         // if (isDoc)
//         //   return (
//         //     <Suspense fallback={<Spinner />}>
//         //       <DocEditor params={{ room: assetId }} />
//         //     </Suspense>
//         //   );
//         return (
//           <Suspense fallback={<Spinner />}>
//             <FilePreview />
//           </Suspense>
//         );
//       case "AudioFile":
//         return (
//           <Suspense fallback={<Spinner />}>
//             <AudioPlayer
//               src={data.url}
//               duration={data.duration}
//               fileName={data.name}
//               forceDarkMode
//             />
//           </Suspense>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <LibraryLayout>
//       <CommentsProvider
//         fileId={assetId}
//         fileName={data?.name ?? ""}
//         fileType={data?.resourcetype ?? "File"}
//       >
//         <DetectionProvider
//           fileId={assetId}
//           fileName={data?.name ?? ""}
//           fileType={data?.resourcetype ?? "File"}
//         >
//           <div className="flex w-full flex-col">
//             {isMobile && fileData?.resourcetype === "VersionStack" && (
//               <VersionSelectorLibrary versionStackId={fileData?.id} />
//             )}
//             <PanelGroup
//               direction="horizontal"
//               className={cn("flex", !isMobile && "pr-6")}
//             >
//               <Panel
//                 defaultSize={70}
//                 minSize={60}
//                 order={1}
//                 className="flex w-full flex-col"
//               >
//                 {/* <div className={cn('relative h-full w-full pb-4', isMobile && 'flex flex-col pb-0')}> */}

//                 <PanelGroup
//                   direction="vertical"
//                   className={cn(
//                     "relative h-full w-full pb-4",
//                     isMobile && "pb-0"
//                   )}
//                 >
//                   <Panel minSize={20} defaultSize={30} maxSize={70} order={1}>
//                     <>
//                       <div
//                         className={cn(
//                           "text-ds-asset-preview-text-primary ",
//                           "flex h-full w-full flex-col items-center justify-center rounded-[20px]",
//                           "relative overflow-hidden",
//                           isRemixesEnabled &&
//                             !isMobile &&
//                             data?.resourcetype === "VideoFile" &&
//                             data.index_status === "completed" &&
//                             "pb-16",
//                           isMobile && " rounded-none"
//                           // data?.resourcetype === 'VideoFile' && 'relative'
//                         )}
//                       >
//                         {/* <AnimatePresence>
//                       {isMobile &&
//                         fileData?.resourcetype === 'VersionStack' &&
//                         showVersionsPanel && (
//                           <motion.div
//                             initial={{ opacity: 0, height: 0 }}
//                             animate={{ opacity: 1, height: 130 }}
//                             exit={{ opacity: 0, height: 0 }}
//                             className="overflow-hidden"
//                           >
//                             <VersionSelectorLibrary versionStackId={fileData?.id} />
//                           </motion.div>
//                         )}
//                     </AnimatePresence> */}

//                         <div
//                           className={cn(
//                             isCanvas || isDoc || isDraft
//                               ? "bg-ds-menu-bg text-ds-menu-text-primary"
//                               : "bg-ds-asset-preview-bg text-ds-asset-preview-text-primary",
//                             "flex h-full w-full items-center justify-center rounded-[20px] transition-background",
//                             "relative overflow-visible",
//                             "overflow-hidden",
//                             isMobile &&
//                               "items-start rounded-none bg-transparent"
//                           )}
//                         >
//                           <AnimatePresence>
//                             {data?.resourcetype === "VideoFile" && (
//                               <motion.div
//                                 className="absolute top-5 z-[51]"
//                                 initial={{ opacity: 0 }}
//                                 animate={{
//                                   opacity:
//                                     compositionToPreview.length > 0 ? 1 : 0,
//                                 }}
//                                 exit={{ opacity: 0 }}
//                               >
//                                 <Tabs
//                                   aria-label="Asset tabs"
//                                   variant="glass"
//                                   selectedKey={selectedVideoTab}
//                                   onSelectionChange={(key) =>
//                                     setSelectedVideoTab(key as VideoTab)
//                                   }
//                                   className={cn(
//                                     !(compositionToPreview.length > 0) &&
//                                       "pointer-events-none"
//                                   )}
//                                 >
//                                   <Tab key="original" title="Original" />
//                                   <Tab key="editor" title="Editor" />
//                                 </Tabs>
//                               </motion.div>
//                             )}
//                           </AnimatePresence>

//                           <div
//                             className={cn(
//                               selectedTab === "preview"
//                                 ? "flex h-full w-full items-center justify-center"
//                                 : "hidden",
//                               isMobile && "items-start rounded-none"
//                             )}
//                           >
//                             <Suspense fallback={<Spinner color="danger" />}>
//                               {isLoading && <Spinner />}
//                               {!isLoading && getAssetPreview()}
//                               <ReviewHotkeys
//                                 resourceType={data?.resourcetype}
//                               />
//                             </Suspense>
//                           </div>
//                         </div>
//                       </div>

//                       {isRemixesEnabled &&
//                       !isMobile &&
//                       data?.resourcetype === "VideoFile" &&
//                       data.index_status === "completed" ? (
//                         <AssetRemixBar
//                           assetId={data?.id}
//                           videoUrl={data.url}
//                           duration={data.duration}
//                           name={data.name}
//                         />
//                       ) : null}
//                     </>
//                   </Panel>

//                   {isMobile && (
//                     <>
//                       <PanelResizeHandle direction="vertical" />
//                       <Panel
//                         defaultSize={70}
//                         minSize={30}
//                         maxSize={80}
//                         className="h-full w-full flex-1"
//                         order={2}
//                       >
//                         <div className={cn("h-full w-full flex-1")}>
//                           <Suspense fallback={<Spinner />}>
//                             <CommentPanel />
//                           </Suspense>
//                         </div>
//                       </Panel>
//                     </>
//                   )}
//                 </PanelGroup>
//                 {/* </div> */}
//               </Panel>
//               {showSidepanel && (
//                 <>
//                   <PanelResizeHandle />
//                   <Panel defaultSize={30} maxSize={40} minSize={30} order={2}>
//                     <div className="flex h-full w-full rounded-5 pb-4">
//                       <CurvedTabs
//                         selectedKey={selectedPanelTab}
//                         onSelectionChange={(key) => {
//                           setSelectedPanelTab(key as AssetPageTab);
//                           if (key === "comments") {
//                             setSelectedTab("preview");
//                           }
//                         }}
//                         tabs={[
//                           ...(showComments
//                             ? [
//                                 {
//                                   key: "comments",
//                                   label: <BubbleText6 size={20} />,
//                                   children: (
//                                     <Suspense>
//                                       <CommentPanel />
//                                     </Suspense>
//                                   ),
//                                 },
//                               ]
//                             : []),
//                           {
//                             key: "metadata",
//                             label: <Server size={20} />,
//                             children: (
//                               <Suspense
//                                 fallback={
//                                   <div className="flex h-full w-full items-center justify-center">
//                                     <Spinner size="md" />
//                                   </div>
//                                 }
//                               >
//                                 {/* {isDetectionOpen ? (
//                                   <DetectionPanel
//                                     setIsDetectionOpen={setIsDetectionOpen}
//                                   />
//                                 ) : (
//                                   <MetadataPanel
//                                     assetName={data?.name ?? ""}
//                                     setIsDetectionOpen={setIsDetectionOpen}
//                                   />
//                                 )} */}
//                               </Suspense>
//                             ),
//                           },
//                           {
//                             key: "technical-metadata",
//                             label: <CircleInfo size={20} />,
//                             children: (
//                               <Suspense>
//                                 <TechnicalMetadata data={data} />
//                               </Suspense>
//                             ),
//                             removeVerticalPadding: true,
//                           },
//                           ...(hasSecurityGroupPermission
//                             ? [
//                                 {
//                                   key: "access",
//                                   label: <Lock size={20} />,
//                                   children: (
//                                     <Access assetId={assetId as string} />
//                                   ),
//                                   removeVerticalPadding: true,
//                                 },
//                               ]
//                             : []),
//                         ]}
//                       />
//                       {/* <AnimatedTabs
//                       selectedPanelTab={selectedPanelTab}
//                       setSelectedPanelTab={setSelectedPanelTab}
//                       setSelectedTab={setSelectedTab}
//                       showComments={showComments}
//                       assetName={data?.name ?? ''}
//                     /> */}
//                     </div>
//                   </Panel>
//                 </>
//               )}
//             </PanelGroup>
//           </div>
//         </DetectionProvider>
//       </CommentsProvider>
//     </LibraryLayout>
//   );
// };

// const AssetPageWithProviders = ({
//   initialData,
// }: {
//   initialData: AssetDetails;
// }) => {
//   const { assetId: fileId } = useParams() as { assetId: string };

//   const searchParams = useSearchParams();
//   const assetId = searchParams.get("version") ?? fileId;

//   const { session } = useAuth();
//   const user = session?.user;

//   const { selectedShape, selectedColor } = useReviewStore();

//   return (
//     <RoomProvider
//       id={`${roomPrefixes.asset}:${assetId}`}
//       initialPresence={{
//         id: user?.id || "",
//         name:
//           user?.profile?.display_name ||
//           `${user?.profile?.first_name}&nbsp;${user?.profile?.last_name}` ||
//           "Anonymous",
//         email: user?.email as string,
//         avatar: user?.profile?.profile_picture || "",
//         color: user?.profile?.color || "red",
//         cursor: null,
//         currentShape: defaultShape(
//           selectedShape,
//           selectedColor
//         ) as LiveShapePreview,
//         isAddingReview: false,
//         currentTime: 0,
//         drawings: [],
//         leaderId: null,
//         isPlaying: false,
//       }}
//       initialStorage={{}}
//     >
//       <PlayerContextProvider>
//         <AssetPage initialData={initialData} />
//       </PlayerContextProvider>
//     </RoomProvider>
//   );
// };

// export { AssetPageWithProviders };

export const ReviewPage = () => {
  return <div>ReviewPage</div>;
};
