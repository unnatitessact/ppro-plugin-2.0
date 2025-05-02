// import React, {
//   forwardRef,
//   UIEvent,
//   useCallback,
//   useEffect,
//   useMemo,
//   useState,
// } from "react";

// import { useDetection } from "@/context/detection";
// import { usePlayerContext } from "@/context/player";
// import { CircularProgress, cn, Skeleton } from "@nextui-org/react";
// import { ProcessingDoneIcon } from "@tessact/tessact-icons";
// import { useMediaRemote } from "@vidstack/react";
// import { SubtitlesIcon } from "@vidstack/react/icons";
// import { AnimatePresence, motion } from "framer-motion";
// import fileDownload from "js-file-download";
// import pluralize from "pluralize";
// import { Virtuoso } from "react-virtuoso";

// import { ArrowInbox, ChevronRightSmall, TextSize } from "@tessact/icons";

// import { Button } from "@/components/ui/Button";
// import { Listbox, ListboxItem } from "@/components/ui/Listbox";
// import {
//   DropdownMenuItem,
//   DropdownMenuSub,
//   DropdownMenuSubContent,
//   DropdownMenuSubTrigger,
// } from "@/components/ui/RadixDropdown";
// import TextArea from "@/components/ui/TextArea";

// // import { DetectionDownloadMenuItem } from '@/components/detection/DetectionDownloadMenuItem';
// // import DetectionSectionActionbar from '@/components/detection/DetectionSectionActionbar';

// import useZodForm from "@/hooks/useZodForm";

// // import { useDetectionTranslateCaption } from '@/api-integration/mutations/detection';
// import { useDetectionCategoryMetadataQuery } from "@/api-integration/queries/detection";
// import { useSubtitlesQuery } from "@/api-integration/queries/video";
// import {
//   Subtitle,
//   subtitle_language_codes,
//   SubtitleLanguageCode,
// } from "@/api-integration/types/video";

// // import { CaptionEditSchema } from "@/schemas/library/detection";

// import { renderValue } from "@/utils/videoUtils";

// const CaptionDetection = () => {
//   const { fileId } = useDetection();
//   const { data: subtitles } = useSubtitlesQuery(fileId);

//   const [searchValue, setSearchValue] = useState("");
//   const [selectedLanguage, setSelectedLanguage] = useState<
//     SubtitleLanguageCode | undefined
//   >(
//     subtitles
//       ? subtitles.find((subtitle) => subtitle?.process_status === "completed")
//           ?.language_code
//       : undefined
//   );

//   const [scrolled, setScrolled] = useState(false);

//   const handleScroll = useCallback((e: UIEvent<HTMLDivElement>) => {
//     const scrollTop = e.currentTarget.scrollTop;
//     if (scrollTop > 0) {
//       setScrolled(true);
//     } else {
//       setScrolled(false);
//     }
//   }, []);
//   // Check if any subtitles are available and set the first language as the selected language

//   useEffect(() => {
//     if (!selectedLanguage && subtitles && subtitles.length > 0) {
//       const completedLanguage = subtitles.find(
//         (subtitle) => subtitle.process_status === "completed"
//       );
//       setSelectedLanguage(completedLanguage?.language_code);
//     }
//   }, [subtitles, selectedLanguage]);

//   // Fetch the caption metadata for the selected language
//   const { data, isLoading } = useDetectionCategoryMetadataQuery(
//     "subtitle",
//     selectedLanguage
//   );

//   const filteredData = useMemo(() => {
//     return data?.filter((caption) =>
//       caption.item.toLowerCase().includes(searchValue.toLowerCase())
//     );
//   }, [data, searchValue]);

//   return (
//     <div className="flex h-full w-full flex-col">
//       <DetectionSectionActionbar
//         searchValue={searchValue}
//         onSearchValueChange={setSearchValue}
//         DropdownMenuItems={() => (
//           <CaptionDetectionDropdownMenuItemsMemo
//             subtitles={subtitles ?? []}
//             selectedLanguage={selectedLanguage}
//             setSelectedLanguage={setSelectedLanguage}
//           />
//         )}
//       >
//         {!isLoading && (
//           <>
//             {data?.length} {pluralize("caption", data?.length)} detected
//           </>
//         )}
//       </DetectionSectionActionbar>
//       <div className="flex h-full min-h-0 flex-col gap-3">
//         {isLoading || !data ? (
//           <Listbox
//             className="pointer-events-none bg-transparent"
//             selectionMode="none"
//           >
//             {[...Array(5)].map((_, index) => (
//               <ListboxItem key={index}>
//                 <Skeleton className="h-3 w-10" />
//               </ListboxItem>
//             ))}
//           </Listbox>
//         ) : (
//           <Virtuoso
//             style={{
//               height: "100%",
//             }}
//             onScroll={handleScroll}
//             className={cn(
//               "border-t border-transparent",
//               scrolled && "border-default-200"
//             )}
//             data={filteredData}
//             itemContent={(_, caption) => (
//               <div className="px-2">
//                 <CaptionItem
//                   key={caption.id}
//                   caption={caption.item}
//                   timestamp={{
//                     startTime: caption?.timestamps?.[0]?.start_time,
//                     endTime: caption?.timestamps?.[0]?.end_time,
//                   }}
//                 />
//               </div>
//             )}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// const CaptionDetectionDropdownMenuItems = ({
//   selectedLanguage,
//   setSelectedLanguage,
//   subtitles,
// }: {
//   subtitles: Subtitle[];
//   selectedLanguage?: SubtitleLanguageCode;
//   setSelectedLanguage: (language_code: SubtitleLanguageCode) => void;
// }) => {
//   const { fileName } = useDetection();

//   const handleSubtitleDownload = (
//     url: string,
//     language_code: SubtitleLanguageCode
//   ) => {
//     fetch(url)
//       .then((response) => response.blob())
//       .then((blob) => {
//         const downloadedFileName = `${fileName}-${language_code}.srt`;
//         fileDownload(blob, downloadedFileName);
//       })
//       .catch((error) => {
//         console.error("Error downloading subtitle:", error);
//       });
//   };

//   return (
//     <>
//       <DropdownMenuSub>
//         <DropdownMenuSubTrigger
//           startContent={<TextSize size={20} />}
//           endContent={<ChevronRightSmall size={20} />}
//         >
//           Translate
//         </DropdownMenuSubTrigger>
//         <DropdownMenuSubContent className="mb-10 max-h-96 overflow-hidden p-0">
//           <div className="overflow-y-auto p-2">
//             {subtitle_language_codes.map((language) => (
//               <CaptionTranslateDropdownItem
//                 key={language}
//                 language={language}
//                 selectedLanguage={selectedLanguage}
//                 setSelectedLanguage={setSelectedLanguage}
//                 subtitles={subtitles}
//               />
//             ))}
//           </div>
//         </DropdownMenuSubContent>
//       </DropdownMenuSub>
//       <DropdownMenuSub>
//         <DropdownMenuSubTrigger
//           startContent={<ArrowInbox size={20} />}
//           endContent={<ChevronRightSmall size={20} />}
//         >
//           Download
//         </DropdownMenuSubTrigger>
//         <DropdownMenuSubContent className="mb-10 max-h-96 overflow-hidden p-0">
//           <div className="overflow-y-auto p-2">
//             {subtitles &&
//               subtitles
//                 ?.filter((subtitle) => subtitle.process_status === "completed")
//                 ?.map((subtitle) => {
//                   const languageLabel = (
//                     subtitle.language_code.charAt(0).toUpperCase() +
//                     subtitle.language_code.slice(1)
//                   ).replace("_", " ");

//                   return (
//                     <DropdownMenuItem
//                       key={subtitle.id}
//                       className="capitalize"
//                       startContent={<SubtitlesIcon size={20} />}
//                       onSelect={() =>
//                         handleSubtitleDownload(
//                           subtitle.url,
//                           subtitle.language_code
//                         )
//                       }
//                       endContent={<FileExtension extension="srt" />}
//                     >
//                       {languageLabel}
//                     </DropdownMenuItem>
//                   );
//                 })}
//             <DetectionDownloadMenuItem
//               category="subtitle"
//               label="Download All"
//             />
//           </div>
//         </DropdownMenuSubContent>
//       </DropdownMenuSub>
//     </>
//   );
// };

// export const CaptionDetectionDropdownMenuItemsMemo = React.memo(
//   CaptionDetectionDropdownMenuItems
// );

// const CaptionTranslateDropdownItem = ({
//   language,
//   selectedLanguage,
//   setSelectedLanguage,
//   subtitles,
// }: {
//   language: SubtitleLanguageCode;
//   selectedLanguage?: SubtitleLanguageCode;
//   setSelectedLanguage: (language_code: SubtitleLanguageCode) => void;
//   subtitles: Subtitle[];
// }) => {
//   const { mutate: translateCaptions, isPending: isTranslatingCaptions } =
//     useDetectionTranslateCaption(language);

//   const subtitle = subtitles?.find(
//     (subtitle) => subtitle.language_code === language
//   );

//   const [isTranslationYetToStart, setIsTranslationYetToStart] = useState(false);

//   const handleSubtitleTranslate = (language_code: SubtitleLanguageCode) => {
//     // Check if language_code exists in subtitles,
//     // If it does not only then call api
//     if (subtitle?.process_status === "completed") {
//       setSelectedLanguage(language_code);
//       return;
//     }
//     // Set the flag to show that translation is yet to start
//     setIsTranslationYetToStart(true);
//     // Call the mutation to translate captions
//     translateCaptions();
//   };

//   const icon = useMemo(() => {
//     return getSubtitleProcessStatusIcon(isTranslationYetToStart, subtitle?.eta);
//   }, [isTranslationYetToStart, subtitle?.eta]);

//   const languageLabel = useMemo(() => {
//     const words = language.split("_").join(" ");
//     return words.charAt(0).toUpperCase() + words.slice(1);
//   }, [language]);

//   return (
//     <DropdownMenuItem
//       key={language}
//       onSelect={(event) => {
//         event.preventDefault(); // Prevents closing the dropdown
//         handleSubtitleTranslate(language);
//       }}
//       endContent={icon}
//       className={cn(selectedLanguage === language && "bg-ds-menu-selected")}
//       disabled={
//         subtitle?.process_status !== "completed" &&
//         (isTranslatingCaptions ||
//           subtitle?.process_status === "in_progress" ||
//           isTranslationYetToStart)
//       }
//     >
//       {languageLabel}
//     </DropdownMenuItem>
//   );
// };

// export default CaptionDetection;

// type Timestamp = {
//   startTime: number;
//   endTime: number;
// };

// type Caption = {
//   caption: string;
//   timestamp: Timestamp;
// };

// export const CaptionItem = ({ caption, timestamp }: Caption) => {
//   const {
//     player,
//     playerState: { timeFormat, fps },
//   } = usePlayerContext();
//   const remote = useMediaRemote(player);
//   const startTime = useMemo(
//     () => renderValue(timestamp.startTime, timeFormat, fps),
//     [timestamp.startTime, timeFormat, fps]
//   );
//   const endTime = useMemo(
//     () => renderValue(timestamp.endTime, timeFormat, fps),
//     [timestamp.endTime, timeFormat, fps]
//   );
//   const [isEditing, setIsEditing] = useState(false);
//   const [captionValue, setCaptionValue] = useState(caption);
//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useZodForm({
//     schema: CaptionEditSchema,
//   });
//   const discardEdit = () => {
//     setIsEditing(false);
//     reset();
//   };

//   return (
//     <motion.form
//       onKeyDown={(e) => {
//         e.key === "Escape" && discardEdit();
//       }}
//       className="relative mb-1 flex cursor-pointer flex-col rounded-5 bg-ds-menu-bg p-3 transition-colors hover:bg-ds-menu-bg-hover"
//       onPointerDown={() => {
//         remote.seek(timestamp.startTime);
//       }}
//       onSubmit={handleSubmit((data) => {
//         setCaptionValue(data.caption);
//         setIsEditing(false);
//       })}
//     >
//       <motion.div
//         transition={{
//           duration: 0.125,
//         }}
//         className="flex w-full flex-col gap-2"
//       >
//         <motion.div className="flex w-full items-center">
//           <motion.p className="w-full flex-1 text-sm font-medium text-ds-pills-tags-text">
//             {startTime} - {endTime}
//           </motion.p>

//           {!isEditing && (
//             <></>
//             // <Dropdown placement="bottom-end">
//             //   <DropdownTrigger>
//             //     <Button size="xs" className="rounded-sm" variant="light" isIconOnly>
//             //       <DotGrid1X3Horizontal size={20} />
//             //     </Button>
//             //   </DropdownTrigger>
//             //   <DropdownMenu>
//             //     <DropdownItem
//             //       startContent={<Pencil size={20} />}
//             //       onPress={() => setIsEditing((prev) => !prev)}
//             //     >
//             //       Edit
//             //     </DropdownItem>
//             //     <DropdownItem startContent={<TrashCan size={20} />}>Delete</DropdownItem>
//             //   </DropdownMenu>
//             // </Dropdown>
//           )}
//         </motion.div>

//         {isEditing ? (
//           <AnimatedInput
//             autoFocus
//             defaultValue={captionValue}
//             placeholder="Enter a caption"
//             isInvalid={!!errors.caption}
//             errorMessage={errors.caption?.message}
//             {...register("caption")}
//           />
//         ) : (
//           <motion.p className="min-w-0 overflow-hidden text-wrap text-ds-text-primary">
//             {captionValue}
//           </motion.p>
//         )}
//       </motion.div>
//       <AnimatePresence>
//         {isEditing && (
//           <motion.div
//             className="flex flex-shrink-0  self-end"
//             initial={{
//               height: 0,
//               opacity: 0,
//             }}
//             animate={{
//               height: "auto",
//               opacity: 1,
//             }}
//             exit={{
//               height: 0,
//               opacity: 0,
//             }}
//           >
//             <div className="flex w-full items-center gap-2 pt-4">
//               <Button
//                 color="secondary"
//                 onPress={discardEdit}
//                 aria-label="Discard detection edit"
//               >
//                 Discard
//               </Button>
//               <Button
//                 color="default"
//                 type="submit"
//                 aria-label="Save detection edit"
//               >
//                 Save
//               </Button>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </motion.form>
//   );
// };

// const AnimatedInput = motion(forwardRef(TextArea));

// const FileExtension = ({ extension }: { extension: string }) => {
//   return (
//     <span className="normal-case text-ds-menu-text-header">.{extension}</span>
//   );
// };

// export const getSubtitleProcessStatusIcon = (
//   isYetToStart: boolean,
//   eta?: Subtitle["eta"]
// ) => {
//   if (eta !== undefined) {
//     if (eta === 0) {
//       return (
//         <CircularProgress
//           size="sm"
//           color="default"
//           classNames={{
//             svg: "w-6 h-6",
//             indicator: "stroke-ds-button-primary-bg",
//           }}
//         />
//       );
//     } else if (eta > 0 && eta < 1) {
//       return (
//         <CircularProgress
//           size="sm"
//           color="default"
//           classNames={{
//             svg: "w-6 h-6",
//             indicator: "stroke-ds-button-primary-bg",
//           }}
//           valueLabel={`${eta * 100}%`}
//           showValueLabel
//           value={eta * 100}
//         />
//       );
//     } else if (eta === 1) {
//       return (
//         <ProcessingDoneIcon className="text-green-400" width={20} height={20} />
//       );
//     }
//   }
//   if (isYetToStart) {
//     return (
//       <CircularProgress
//         size="sm"
//         color="default"
//         classNames={{
//           svg: "w-6 h-6",
//           indicator: "stroke-ds-button-primary-bg",
//         }}
//       />
//     );
//   }
//   return <div className="size-6" />;
// };
