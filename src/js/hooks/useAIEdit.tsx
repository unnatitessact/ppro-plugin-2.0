// import { useState } from "react";

// import { DEFAULT_FONT } from "../../features/editor/data/fonts";
// import {
//   ADD_AUDIO,
//   ADD_COMPONENT,
//   ADD_IMAGE,
//   ADD_SUBTITLE,
//   ADD_TEXT,
//   ADD_VIDEO,
//   DESIGN_DELETE,
//   dispatcher,
// } from "@/packages/@tessact/editor";
// import { nanoid } from "nanoid";

// import { AIEditResponse } from "@/api-integration/types/editor";
// import { Scene, Transcription } from "@/api-integration/types/remixes";

// import { DEFAULT_TITLE_PROPERTIES } from "@/utils/remixUtils";

// export const useAIEdit = () => {
//   const [isLoading, setIsLoading] = useState(false);

//   const addToTimeline = (
//     data: AIEditResponse,
//     canvasDimensions?: {
//       width: number;
//       height: number;
//     },
//     fps?: number
//   ) => {
//     setIsLoading(true);

//     dispatcher.dispatch(DESIGN_DELETE, {
//       payload: {
//         width: canvasDimensions?.width,
//         height: canvasDimensions?.height,
//         fps,
//       },
//     });

//     console.log("DEBUG: Composition to add inside useAIEdit", data);

//     const videoTrackId = nanoid();
//     const captionsTrackId = nanoid();
//     const graphicTrackId = nanoid();
//     const audioTrackId = nanoid();
//     const subtitleTrackId = nanoid();
//     const codeTrackId = nanoid();

//     const videoClips = data.filter((item) => item?.type === "video");
//     const textClips = data.filter((item) => item?.type === "text");
//     const graphicClips = data.filter((item) => item?.type === "graphic");
//     const audioClips = data.filter((item) => item?.type === "audio");
//     const subtitleClips = data.filter((item) => item?.type === "subtitle");
//     const codeComponents = data.filter((item) => item?.type === "code");

//     console.log("DEBUG: Video clips inside useAIEdit", videoClips);
//     console.log("DEBUG: Text clips inside useAIEdit", textClips);
//     console.log("DEBUG: Graphic clips inside useAIEdit", graphicClips);
//     console.log("DEBUG: Audio clips inside useAIEdit", audioClips);
//     console.log("DEBUG: Subtitle clips inside useAIEdit", subtitleClips);
//     console.log("DEBUG: Code components inside useAIEdit", codeComponents);

//     setTimeout(() => {
//       videoClips.forEach((item) => {
//         dispatcher.dispatch(ADD_VIDEO, {
//           payload: {
//             id: nanoid(),
//             details: {
//               src: item.src,
//               sprite_sheet: item.sprite_sheet,
//               sprite_width: item.sprite_width,
//               sprite_height: item.sprite_height,
//               number_of_sprites: item.number_of_sprites,
//               sprite_rows: item.sprite_rows,
//               sprite_columns: item.sprite_columns,
//               volume: item.volume ?? 1,
//               speed: item.speed ?? 1,
//               is_face_tracked: item.is_face_tracked,
//               face_tracked_data: item.face_tracked_data,
//               subtitles: item.subtitles,
//               subtitles_language: item.subtitles_language,
//             },
//             metadata: {
//               resourceId: item.video_id,
//             },
//             type: "video",
//             options: {
//               trackId: videoTrackId,
//             },
//             display: {
//               from: item.timeline_position * 1000,
//               to:
//                 item.timeline_position * 1000 +
//                 (item.end_time - item.start_time) * 1000,
//             },
//             trim: {
//               from: item.start_time * 1000,
//               to: item.end_time * 1000,
//             },
//           },
//         });
//       });
//     }, 1000);

//     setTimeout(() => {
//       audioClips.forEach((item) => {
//         dispatcher.dispatch(ADD_AUDIO, {
//           payload: {
//             id: nanoid(),
//             details: {
//               src: item.url,
//               volume: item.volume ?? 1,
//               speed: item.speed ?? 1,
//             },
//             options: {
//               trackId: audioTrackId,
//             },
//             metadata: {
//               resourceId: item.id,
//               name: item.name || "",
//             },
//             display: {
//               from: item.timeline_position * 1000,
//               to:
//                 item.timeline_position * 1000 +
//                 (item.end_time - item.start_time) * 1000,
//             },
//             trim: {
//               from: item.start_time * 1000,
//               to: item.end_time * 1000,
//             },
//           },
//         });
//       });
//     }, 1000);

//     setTimeout(() => {
//       textClips.forEach((item) => {
//         if (item.isTitleOverlay) {
//           dispatcher.dispatch(ADD_TEXT, {
//             payload: {
//               id: nanoid(),
//               details: {
//                 text: item.text,
//                 fontSize:
//                   item.titleOverlayProperties?.properties.fontSize || 72,
//                 fontWeight:
//                   item.titleOverlayProperties?.properties.fontWeight ||
//                   DEFAULT_TITLE_PROPERTIES.properties.fontWeight,
//                 width: canvasDimensions?.width || 900,
//                 fontFamily:
//                   item.titleOverlayProperties?.properties.fontFamily ||
//                   DEFAULT_TITLE_PROPERTIES.properties.fontFamily,
//                 fontUrl: DEFAULT_FONT.url,
//                 color:
//                   item.titleOverlayProperties?.properties.color ||
//                   DEFAULT_TITLE_PROPERTIES.properties.color,
//                 textShadow:
//                   item.titleOverlayProperties?.properties.textShadow ||
//                   DEFAULT_FONT.url,
//                 paintOrder: "stroke fill",
//                 textTransform:
//                   item.titleOverlayProperties?.properties.textTransform ||
//                   "none",
//                 // WebkitTextStroke: '20px rgba(0,0,0,0.5)',
//                 // letterSpacing: 2
//               },
//               display: {
//                 from: item.timeline_position * 1000,
//                 to:
//                   item.timeline_position * 1000 +
//                   (item.end_time - item.start_time) * 1000,
//               },
//               options: {
//                 trackId: captionsTrackId,
//               },
//             },
//           });
//         } else {
//           dispatcher.dispatch(ADD_TEXT, {
//             payload: {
//               id: nanoid(),
//               details: {
//                 text: item.text,
//                 fontSize: 60,
//                 width: canvasDimensions?.width || 900,
//                 fontUrl: DEFAULT_FONT.url,
//                 fontFamily: DEFAULT_FONT.postScriptName,
//                 color: "#ffffff",
//                 wordWrap: "break-word",
//                 fontWeight: 900,
//               },
//               display: {
//                 from: item.timeline_position * 1000,
//                 to:
//                   item.timeline_position * 1000 +
//                   (item.end_time - item.start_time) * 1000,
//               },
//               options: {
//                 trackId: captionsTrackId,
//               },
//             },
//           });
//         }
//       });
//     }, 2500);

//     setTimeout(() => {
//       for (const item of graphicClips) {
//         dispatcher.dispatch(ADD_IMAGE, {
//           payload: {
//             id: nanoid(),
//             details: {
//               src: item.url || "",
//               x: item.x,
//               y: item.y,
//               scale: item.scale || 1,
//             },
//             options: {
//               trackId: graphicTrackId,
//             },
//             display: {
//               from: item.timeline_position * 1000,
//               to:
//                 item.timeline_position * 1000 +
//                 (item.end_time - item.start_time) * 1000,
//             },
//             metadata: { resourceId: item.id },
//           },
//         });
//       }
//     }, 3000);

//     setTimeout(() => {
//       subtitleClips.forEach((item) => {
//         dispatcher.dispatch(ADD_SUBTITLE, {
//           payload: {
//             id: nanoid(),
//             details: {
//               text: item.text,
//               fontSize: 120,
//               width: 600,
//               fontUrl: DEFAULT_FONT.url,
//               fontFamily: DEFAULT_FONT.postScriptName,
//               color: "#ffffff",
//             },
//             display: {
//               from: item.timeline_position * 1000,
//               to:
//                 item.timeline_position * 1000 +
//                 (item.end_time - item.start_time) * 1000,
//             },
//             options: {
//               trackId: subtitleTrackId,
//             },
//           },
//         });
//       });
//     }, 3500);

//     setTimeout(() => {
//       codeComponents.forEach((item) => {
//         dispatcher.dispatch(ADD_COMPONENT, {
//           payload: {
//             id: nanoid(),
//             details: {
//               code: item.code,
//             },
//             display: {
//               from: item.timeline_position * 1000,
//               to:
//                 item.timeline_position * 1000 +
//                 (item.end_time - item.start_time) * 1000,
//             },
//             options: {
//               trackId: codeTrackId,
//             },
//           },
//         });
//       });
//     }, 3500);

//     setTimeout(() => {
//       setIsLoading(false);
//     }, 3500);
//   };

//   const addSubtitlesToTimeline = (
//     scenes: Scene[],
//     transcriptions: Transcription[]
//   ) => {
//     setIsLoading(true);

//     const trackId = nanoid();

//     scenes.forEach((scene, index) => {
//       const previousScenesDuration = scenes
//         .slice(0, index)
//         .reduce((sum, s) => sum + (s.end_time - s.start_time), 0);

//       const sceneTranscriptions = transcriptions?.[index]?.items || [];

//       setTimeout(() => {
//         sceneTranscriptions.forEach((item) => {
//           const itemStartTime =
//             (item.start_time - scene.start_time + previousScenesDuration) *
//             1000;
//           const itemDuration = (item.end_time - item.start_time) * 1000;

//           if (itemDuration <= 0) return;

//           dispatcher.dispatch(ADD_SUBTITLE, {
//             payload: {
//               id: nanoid(),
//               details: {
//                 text: item.text,
//                 fontSize: 120,
//                 width: 600,
//                 fontUrl: DEFAULT_FONT.url,
//                 fontFamily: DEFAULT_FONT.postScriptName,
//                 color: "#ffffff",
//               },
//               display: {
//                 from: itemStartTime,
//                 to: itemStartTime + itemDuration,
//               },
//               options: { trackId },
//             },
//           });
//         });
//       }, 3500);

//       setTimeout(() => {
//         setIsLoading(false);
//       }, 3500);
//     });
//   };

//   return {
//     addToTimeline,
//     addSubtitlesToTimeline,
//     isLoading,
//   };
// };
