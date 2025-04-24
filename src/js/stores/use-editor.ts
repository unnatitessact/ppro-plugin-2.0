// import React from "react";

// import { defaultCaptionStyles } from "@/features/editor-v2/components/overlays/captions/caption-settings";
// import { FPS, INITIAL_ROWS, MAX_ROWS } from "@/features/editor-v2/constants";
// import {
//   getProgress as lambdaGetProgress,
//   renderVideo as lambdaRenderVideo,
// } from "@/features/editor-v2/lambda-helpers/api";
// import {
//   getProgress as ssrGetProgress,
//   renderVideo as ssrRenderVideo,
// } from "../features/editor-v2/ssr-helpers/api";
// import {
//   AspectRatio,
//   CaptionOverlay,
//   CaptionStyles,
//   CompositionProps,
//   Overlay,
//   OverlayType,
//   RenderState,
// } from "../features/editor-v2/types";
// import { PlayerRef } from "@remotion/player";
// import { nanoid } from "nanoid";
// import { z } from "zod";
// import { create, StoreApi, UseBoundStore } from "zustand";
// import { subscribeWithSelector } from "zustand/middleware";

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// type AnyStyleProperties = Record<string, any>;

// // ==== State Interface ====
// interface EditorState {
//   fps: number;
//   playerRef: PlayerRef | null;
//   isPlaying: boolean;
//   currentFrame: number;
//   overlays: Overlay[];
//   selectedOverlayId: string | null;
//   activePropertyPanel: OverlayType | null;
//   pastOverlays: Overlay[][];
//   futureOverlays: Overlay[][];
//   isUndoingOrRedoing: boolean;
//   aspectRatio: AspectRatio;
//   playerDimensions: { width: number; height: number };
//   renderState: RenderState;
//   renderType: "ssr" | "lambda";
//   playbackRate: number;

//   // ++ Timeline State ++
//   visibleRows: number;
//   timelineRef: React.RefObject<HTMLDivElement> | null; // Ref object itself
// }

// // ==== Actions Interface ====
// interface EditorActions {
//   setFps: (fps: number) => void;
//   setPlayerRef: (ref: PlayerRef | null) => void;
//   setIsPlaying: (isPlaying: boolean) => void;
//   setCurrentFrame: (frame: number) => void;
//   play: () => void;
//   togglePlayPause: () => void;
//   seekTo: (frame: number) => void;
//   formatTime: (frames: number) => string;
//   _updateOverlaysWithHistory: (
//     newOverlays: Overlay[],
//     newSelectedId?: string | null
//   ) => void;
//   setOverlays: (overlays: Overlay[]) => void;
//   setSelectedOverlayId: (id: string | null) => void;
//   setActivePropertyPanel: (panel: OverlayType | null) => void;
//   changeOverlay: (
//     id: string,
//     update: Partial<Overlay> | ((overlay: Overlay) => Overlay)
//   ) => void;
//   addOverlay: (newOverlay: Omit<Overlay, "id">) => void;
//   deleteOverlay: (id: string) => void;
//   deleteOverlaysByRow: (row: number) => void;
//   duplicateOverlay: (id: string) => void;
//   splitOverlay: (id: string, splitFrame: number) => void;
//   updateOverlayStyles: (
//     overlayId: string,
//     styles: Partial<AnyStyleProperties>
//   ) => void;
//   resetOverlays: () => void;
//   undo: () => void;
//   redo: () => void;
//   setAspectRatio: (ratio: AspectRatio) => void;
//   updatePlayerDimensions: (
//     containerWidth: number,
//     containerHeight: number
//   ) => void;
//   getAspectRatioDimensions: () => { width: number; height: number };
//   handleTimelineClick: (event: React.MouseEvent<HTMLDivElement>) => void;
//   setRenderType: (type: "ssr" | "lambda") => void;
//   setRenderState: (newState: RenderState) => void;
//   renderMedia: (compositionId: string) => Promise<void>;
//   resetRenderState: () => void;
//   setPlaybackRate: (rate: number) => void;
//   // ++ Timeline Actions ++
//   setVisibleRows: (rows: number) => void;
//   addRow: () => void;
//   removeRow: () => void;

//   // Global reset
//   reset: () => void;
// }

// // Define the store type alias including the selector middleware
// type EditorStoreType = UseBoundStore<StoreApi<EditorState & EditorActions>>;

// // ==== Store ====
// export const useEditor: EditorStoreType = create<EditorState & EditorActions>()(
//   subscribeWithSelector((set, get) => ({
//     // --- Initial State ---
//     fps: FPS,
//     playerRef: null,
//     isPlaying: false,
//     currentFrame: 0,
//     overlays: [],
//     selectedOverlayId: null,
//     activePropertyPanel: null,
//     pastOverlays: [],
//     futureOverlays: [],
//     isUndoingOrRedoing: false,
//     aspectRatio: "16:9",
//     playerDimensions: { width: 640, height: 360 },
//     renderState: { status: "init" },
//     renderType: "lambda",
//     playbackRate: 1,

//     // ++ Initial Timeline State ++
//     visibleRows: INITIAL_ROWS,
//     timelineRef: null,
//     zoomScale: 1,
//     scrollPosition: 0,

//     // --- Video Player Actions ---

//     setFps: (fps) => set({ fps }),
//     setPlayerRef: (ref) => set({ playerRef: ref }),
//     setIsPlaying: (isPlaying) => set({ isPlaying }),
//     setCurrentFrame: (frame) => set({ currentFrame: frame }),
//     play: () => {
//       const player = get().playerRef;
//       if (player) {
//         player.play();
//         set({ isPlaying: true });
//       }
//     },
//     togglePlayPause: () => {
//       const player = get().playerRef;
//       if (!player) return;
//       const currentIsPlaying = get().isPlaying;
//       if (!currentIsPlaying) {
//         player.play();
//       } else {
//         player.pause();
//       }
//       set({ isPlaying: !currentIsPlaying });
//     },
//     seekTo: (frame: number) => {
//       const player = get().playerRef;
//       if (player) {
//         player.seekTo(frame);
//         set({ currentFrame: frame });
//       }
//     },
//     formatTime: (frames: number) => {
//       const fps = get().fps;
//       const totalSeconds = frames / fps;
//       const minutes = Math.floor(totalSeconds / 60);
//       const seconds = Math.floor(totalSeconds % 60);
//       const frames2Digits = Math.floor(frames % fps)
//         .toString()
//         .padStart(2, "0");
//       return `${minutes.toString().padStart(2, "0")}:${seconds
//         .toString()
//         .padStart(2, "0")}.${frames2Digits}`;
//     },

//     // --- Overlay & History Actions ---
//     _updateOverlaysWithHistory: (newOverlays, newSelectedId) => {
//       if (get().isUndoingOrRedoing) return;
//       const currentOverlays = get().overlays;
//       const pastOverlays = get().pastOverlays;
//       const historyLimit = 100;
//       const nextPast = [...pastOverlays, currentOverlays].slice(-historyLimit);
//       const stateUpdate: Partial<EditorState> = {
//         overlays: newOverlays,
//         pastOverlays: nextPast,
//         futureOverlays: [],
//       };
//       if (newSelectedId !== undefined) {
//         stateUpdate.selectedOverlayId = newSelectedId;
//       }
//       set(stateUpdate);
//     },
//     setOverlays: (overlays) => {
//       console.warn("Direct setOverlays called - history not recorded.");
//       set({ overlays, pastOverlays: [], futureOverlays: [] });
//     },
//     setSelectedOverlayId: (id) => set({ selectedOverlayId: id }),
//     setActivePropertyPanel: (panel) => set({ activePropertyPanel: panel }),
//     changeOverlay: (overlayId, updater) => {
//       const currentOverlays = get().overlays;
//       const newOverlays = currentOverlays.map((overlay: Overlay) => {
//         if (overlay.id !== overlayId) return overlay;
//         const updatedOverlay =
//           typeof updater === "function"
//             ? updater(overlay)
//             : { ...overlay, ...updater };
//         return updatedOverlay as Overlay;
//       });
//       get()._updateOverlaysWithHistory(newOverlays);
//     },
//     addOverlay: (newOverlayData) => {
//       const currentOverlays = get().overlays;
//       const newId = nanoid();
//       const overlayWithNewId = { ...newOverlayData, id: newId } as Overlay;
//       const newOverlays = [...currentOverlays, overlayWithNewId];
//       get()._updateOverlaysWithHistory(newOverlays, newId);
//     },
//     deleteOverlay: (id) => {
//       const currentOverlays = get().overlays;
//       const newOverlays = currentOverlays.filter(
//         (overlay: Overlay) => overlay.id !== id
//       );
//       const newSelectedId =
//         get().selectedOverlayId === id ? null : get().selectedOverlayId;
//       get()._updateOverlaysWithHistory(newOverlays, newSelectedId);
//     },
//     deleteOverlaysByRow: (row) => {
//       const currentOverlays = get().overlays;
//       const newOverlays = currentOverlays.filter(
//         (overlay: Overlay) => overlay.row !== row
//       );
//       const newSelectedId = currentOverlays.some(
//         (o: Overlay) => o.id === get().selectedOverlayId && o.row === row
//       )
//         ? null
//         : get().selectedOverlayId;
//       get()._updateOverlaysWithHistory(newOverlays, newSelectedId);
//     },
//     duplicateOverlay: (id) => {
//       const currentOverlays = get().overlays;
//       const overlayToDuplicate = currentOverlays.find(
//         (overlay: Overlay) => overlay.id === id
//       );

//       if (!overlayToDuplicate) return;

//       const newId = nanoid();

//       // Find overlays in the same row, excluding the one being duplicated
//       const overlaysInRow = currentOverlays.filter(
//         (o) => o.row === overlayToDuplicate.row && o.id !== id
//       );

//       // Calculate initial desired start position for the duplicate
//       let newFrom =
//         overlayToDuplicate.from + overlayToDuplicate.durationInFrames;

//       // Check for overlaps and adjust position if needed
//       let hasOverlap = true;
//       while (hasOverlap) {
//         hasOverlap = overlaysInRow.some((existingOverlay) => {
//           const duplicateEnd = newFrom + overlayToDuplicate.durationInFrames;
//           const existingEnd =
//             existingOverlay.from + existingOverlay.durationInFrames;

//           // Check for any overlap:
//           // 1. Duplicate starts within existing overlay
//           // 2. Duplicate ends within existing overlay
//           // 3. Duplicate completely envelops existing overlay
//           return (
//             (newFrom >= existingOverlay.from && newFrom < existingEnd) ||
//             (duplicateEnd > existingOverlay.from &&
//               duplicateEnd <= existingEnd) ||
//             (newFrom <= existingOverlay.from && duplicateEnd >= existingEnd)
//           );
//         });

//         if (hasOverlap) {
//           // Find the overlay that ends latest among those that overlap or start before the current `newFrom`
//           const relevantOverlays = overlaysInRow.filter(
//             (o) =>
//               o.from + o.durationInFrames > newFrom ||
//               (o.from < newFrom && o.from + o.durationInFrames > newFrom)
//           );

//           const lastEndingOverlay = relevantOverlays.sort(
//             (a, b) =>
//               b.from + b.durationInFrames - (a.from + a.durationInFrames)
//           )[0]; // Get the one ending latest

//           if (lastEndingOverlay) {
//             // Position the duplicate right after the latest ending overlapping overlay
//             newFrom =
//               lastEndingOverlay.from + lastEndingOverlay.durationInFrames;
//           } else {
//             // This case should ideally not happen if hasOverlap is true,
//             // but as a fallback, just increment. Or consider placing it at the very end.
//             // Let's place it right after the original to avoid infinite loops in unexpected edge cases.
//             newFrom =
//               overlayToDuplicate.from + overlayToDuplicate.durationInFrames;
//             // Add a small gap to potentially escape the loop if logic is flawed.
//             // Consider logging a warning here if this fallback is triggered often.
//             newFrom += 1;
//             // Re-evaluate hasOverlap to prevent infinite loops in flawed scenarios
//             hasOverlap = overlaysInRow.some((existingOverlay) => {
//               const duplicateEnd =
//                 newFrom + overlayToDuplicate.durationInFrames;
//               const existingEnd =
//                 existingOverlay.from + existingOverlay.durationInFrames;
//               return (
//                 (newFrom >= existingOverlay.from && newFrom < existingEnd) ||
//                 (duplicateEnd > existingOverlay.from &&
//                   duplicateEnd <= existingEnd) ||
//                 (newFrom <= existingOverlay.from && duplicateEnd >= existingEnd)
//               );
//             });
//             // If still overlapping after fallback, break to prevent infinite loop.
//             if (hasOverlap) {
//               console.warn(
//                 "Could not find a non-overlapping position for duplicated overlay. Placing immediately after original."
//               );
//               newFrom =
//                 overlayToDuplicate.from + overlayToDuplicate.durationInFrames;
//               break; // Exit the loop
//             }
//           }
//         }
//       } // End while loop

//       const duplicatedOverlay: Overlay = {
//         ...overlayToDuplicate,
//         id: newId,
//         from: newFrom, // Use the calculated non-overlapping position
//       };

//       const newOverlays = [...currentOverlays, duplicatedOverlay];
//       // Update state and history, selecting the new duplicated overlay
//       get()._updateOverlaysWithHistory(newOverlays, newId);
//     },
//     splitOverlay: (id, splitFrame) => {
//       const currentOverlays = get().overlays;
//       const overlayToSplit = currentOverlays.find(
//         (overlay: Overlay) => overlay.id === id
//       );
//       if (!overlayToSplit) return;
//       if (
//         splitFrame <= overlayToSplit.from ||
//         splitFrame >= overlayToSplit.from + overlayToSplit.durationInFrames
//       ) {
//         console.warn("Invalid split point");
//         return;
//       }
//       const firstPartDuration = splitFrame - overlayToSplit.from;
//       const secondPartDuration =
//         overlayToSplit.durationInFrames - firstPartDuration;
//       const newId = nanoid();
//       const fps = get().fps;
//       const secondHalfStartTime = calculateSecondHalfStartTime(
//         overlayToSplit,
//         firstPartDuration,
//         fps
//       );
//       const [firstHalf, secondHalf] = createSplitOverlays(
//         overlayToSplit,
//         newId,
//         splitFrame,
//         firstPartDuration,
//         secondPartDuration,
//         secondHalfStartTime,
//         fps
//       );
//       const newOverlays = currentOverlays
//         .map((o: Overlay) => (o.id === id ? firstHalf : o))
//         .concat(secondHalf);
//       get()._updateOverlaysWithHistory(newOverlays);
//     },
//     updateOverlayStyles: (overlayId, styles) => {
//       const currentOverlays = get().overlays;
//       const newOverlays = currentOverlays.map((overlay: Overlay) => {
//         if (overlay.id !== overlayId) return overlay;
//         if (overlay.type === OverlayType.CAPTION) {
//           return {
//             ...overlay,
//             styles: {
//               ...(overlay.styles || defaultCaptionStyles),
//               ...(styles as Partial<CaptionStyles>),
//             },
//           } as CaptionOverlay;
//         }
//         return {
//           ...overlay,
//           // eslint-disable-next-line @typescript-eslint/no-explicit-any
//           styles: { ...(overlay as any).styles, ...styles }, // Keep any here for now
//         };
//       });
//       get()._updateOverlaysWithHistory(newOverlays);
//     },
//     resetOverlays: () => {
//       get()._updateOverlaysWithHistory([], null);
//     },
//     undo: () => {
//       const past = get().pastOverlays;
//       if (past.length === 0) return;
//       set({ isUndoingOrRedoing: true });
//       const previousOverlays = past[past.length - 1];
//       const newPast = past.slice(0, past.length - 1);
//       const currentOverlays = get().overlays;
//       const newFuture = [currentOverlays, ...get().futureOverlays];
//       set({
//         overlays: previousOverlays,
//         pastOverlays: newPast,
//         futureOverlays: newFuture,
//         isUndoingOrRedoing: false,
//         selectedOverlayId: null, // Also reset selection on undo
//       });
//     },
//     redo: () => {
//       const future = get().futureOverlays;
//       if (future.length === 0) return;
//       set({ isUndoingOrRedoing: true });
//       const nextOverlays = future[0];
//       const newFuture = future.slice(1);
//       const currentOverlays = get().overlays;
//       const newPast = [...get().pastOverlays, currentOverlays];
//       set({
//         overlays: nextOverlays,
//         pastOverlays: newPast,
//         futureOverlays: newFuture,
//         isUndoingOrRedoing: false,
//         selectedOverlayId: null, // Also reset selection on redo
//       });
//     },

//     // --- Aspect Ratio Actions ---
//     setAspectRatio: (ratio) => {
//       set({ aspectRatio: ratio });
//     },
//     updatePlayerDimensions: (containerWidth, containerHeight) => {
//       const currentRatio = get().aspectRatio;
//       let width, height;
//       const targetRatio =
//         currentRatio === "16:9"
//           ? 16 / 9
//           : currentRatio === "9:16"
//           ? 9 / 16
//           : currentRatio === "1:1"
//           ? 1
//           : 4 / 5;

//       const containerRatio = containerWidth / containerHeight;

//       if (containerRatio > targetRatio) {
//         height = containerHeight;
//         width = height * targetRatio;
//       } else {
//         width = containerWidth;
//         height = width / targetRatio;
//       }
//       if (
//         Math.round(width) !== get().playerDimensions.width ||
//         Math.round(height) !== get().playerDimensions.height
//       ) {
//         set({
//           playerDimensions: {
//             width: Math.round(width),
//             height: Math.round(height),
//           },
//         });
//       }
//     },
//     getAspectRatioDimensions: () => {
//       const currentRatio = get().aspectRatio;
//       switch (currentRatio) {
//         case "9:16":
//           return { width: 1080, height: 1920 };
//         case "4:5":
//           return { width: 1080, height: 1350 };
//         case "1:1":
//           return { width: 1080, height: 1080 };
//         case "16:9":
//         default:
//           return { width: 1920, height: 1080 };
//       }
//     },
//     setPlaybackRate: (rate) => {
//       set({ playbackRate: rate });
//     },

//     // --- Timeline Click Action ---
//     handleTimelineClick: (event) => {
//       const player = get().playerRef;
//       // Use timelineRef from store now
//       const timeline = get().timelineRef?.current;
//       if (!player || !timeline) return;

//       const duration = selectDurationInFrames(get());
//       const timelineRect = timeline.getBoundingClientRect(); // Use timeline rect
//       const clickX = event.clientX - timelineRect.left;
//       const timelineWidth = timelineRect.width || 1;
//       const clickPercentage = Math.max(0, Math.min(1, clickX / timelineWidth));
//       const targetFrame = Math.floor(clickPercentage * duration);

//       get().seekTo(targetFrame);
//     },

//     // +++ Timeline Actions Implementation +++
//     setVisibleRows: (rows) => {
//       set({ visibleRows: Math.max(INITIAL_ROWS, Math.min(rows, MAX_ROWS)) });
//     },
//     addRow: () => {
//       set((state) => ({
//         visibleRows: Math.min(state.visibleRows + 1, MAX_ROWS),
//       }));
//     },
//     removeRow: () => {
//       set((state) => ({
//         visibleRows: Math.max(state.visibleRows - 1, INITIAL_ROWS),
//       }));
//     },

//     // --- Rendering Actions ---
//     setRenderType: (type) => set({ renderType: type }),
//     setRenderState: (newState) => set({ renderState: newState }),
//     resetRenderState: () => set({ renderState: { status: "init" } }),

//     renderMedia: async (compositionId) => {
//       const { overlays, renderType } = get();
//       const durationInFrames = selectDurationInFrames(get());
//       const { width, height } = get().getAspectRatioDimensions();
//       const fps = get().fps;

//       // Construct inputProps from current store state
//       const inputProps: z.infer<typeof CompositionProps> = {
//         overlays,
//         durationInFrames,
//         width,
//         height,
//         fps,
//         src: "", // Assuming src isn't needed or comes from elsewhere
//       };

//       console.log(`Starting renderMedia process using ${renderType}`);
//       set({ renderState: { status: "invoking" } }); // Update state via set

//       try {
//         const renderVideo =
//           renderType === "ssr" ? ssrRenderVideo : lambdaRenderVideo;
//         const getProgress =
//           renderType === "ssr" ? ssrGetProgress : lambdaGetProgress;

//         console.log("Calling renderVideo API with inputProps", inputProps);
//         const response = await renderVideo({ id: compositionId, inputProps });
//         const renderId = response.renderId;
//         const bucketName =
//           "bucketName" in response ? response.bucketName : undefined;

//         if (renderType === "ssr") {
//           await wait(3000);
//         }

//         set({
//           renderState: {
//             status: "rendering",
//             progress: 0,
//             renderId,
//             bucketName: typeof bucketName === "string" ? bucketName : undefined,
//           },
//         });

//         let pending = true;
//         while (pending) {
//           console.log(`Checking progress for renderId=${renderId}`);
//           const result = await getProgress({
//             id: renderId,
//             bucketName: typeof bucketName === "string" ? bucketName : "",
//           });
//           console.log("result", result);
//           switch (result.type) {
//             case "error": {
//               console.error(`Render error: ${result.message}`);
//               set({
//                 renderState: {
//                   status: "error",
//                   renderId: renderId,
//                   error: new Error(result.message),
//                 },
//               });
//               pending = false;
//               break;
//             }
//             case "done": {
//               console.log(
//                 `Render complete: url=${result.url}, size=${result.size}`
//               );
//               set({
//                 renderState: {
//                   size: result.size,
//                   url: result.url,
//                   status: "done",
//                 },
//               });
//               pending = false;
//               break;
//             }
//             case "progress": {
//               console.log(`Render progress: ${result.progress}%`);
//               set((state) => ({
//                 renderState: {
//                   ...state.renderState,
//                   status: "rendering",
//                   progress: result.progress,
//                   renderId: renderId,
//                 },
//               }));
//               await wait(1000);
//               break;
//             }
//           }
//         }
//       } catch (err) {
//         console.error("Unexpected error during rendering:", err);
//         set({
//           renderState: {
//             status: "error",
//             error: err as Error,
//             renderId: null,
//           },
//         });
//       }
//     },
//     reset: () => {
//       set({
//         playerRef: null,
//         isPlaying: false,
//         currentFrame: 0,
//         overlays: [],
//         selectedOverlayId: null,
//         activePropertyPanel: null,
//         pastOverlays: [],
//         futureOverlays: [],
//         isUndoingOrRedoing: false,
//         aspectRatio: "16:9",
//         playerDimensions: { width: 640, height: 360 },
//         renderState: { status: "init" },
//         renderType: "lambda",
//       });
//     },
//   }))
// );

// // --- Selectors ---
// export const selectFps = (state: EditorState) => state.fps;
// export const selectPlaybackRate = (state: EditorState) => state.playbackRate;
// export const selectPlayerRef = (state: EditorState) => state.playerRef;
// export const selectOverlays = (state: EditorState) => state.overlays;
// export const selectSelectedOverlay = (state: EditorState) =>
//   state.overlays.find((o: Overlay) => o.id === state.selectedOverlayId);
// export const selectCanUndo = (state: EditorState) =>
//   state.pastOverlays.length > 0;
// export const selectCanRedo = (state: EditorState) =>
//   state.futureOverlays.length > 0;
// export const selectAspectRatio = (state: EditorState) => state.aspectRatio;
// export const selectPlayerDimensions = (state: EditorState) =>
//   state.playerDimensions;
// export const selectDurationInFrames = (state: EditorState): number => {
//   const overlays = state.overlays;
//   const fps = state.fps;
//   const minDuration = fps * 3;
//   if (!overlays || overlays.length === 0) {
//     return minDuration;
//   }
//   const maxEndFrame = overlays.reduce((maxEnd: number, overlay: Overlay) => {
//     const endFrame = overlay.from + overlay.durationInFrames;
//     return Math.max(maxEnd, endFrame);
//   }, 0);
//   return Math.max(maxEndFrame, minDuration);
// };
// export const selectDurationInSeconds = (state: EditorState): number => {
//   const fps = state.fps;
//   return selectDurationInFrames(state) / fps;
// };
// export const selectRenderState = (state: EditorState) => state.renderState;
// export const selectRenderType = (state: EditorState) => state.renderType;

// // ++ Timeline Selectors ++
// export const selectVisibleRows = (state: EditorState) => state.visibleRows;

// // --- Helper functions ---
// const calculateSecondHalfStartTime = (
//   overlay: Overlay,
//   firstPartDuration: number,
//   fps: number
// ): number => {
//   if (overlay.type === OverlayType.VIDEO) {
//     // Use videoStartTime if available, otherwise default to 0
//     return (overlay.videoStartTime ?? 0) + firstPartDuration / fps; // Convert duration to seconds
//   }
//   if (overlay.type === OverlayType.SOUND) {
//     // Use startFromSound if available, otherwise default to 0
//     return (overlay.startFromSound ?? 0) + firstPartDuration / fps; // Convert duration to seconds
//   }
//   return 0;
// };

// const createSplitOverlays = (
//   original: Overlay,
//   newId: string,
//   splitFrame: number,
//   firstPartDuration: number,
//   secondPartDuration: number,
//   secondHalfStartTime: number,
//   fps: number
// ): [Overlay, Overlay] => {
//   const msPerFrame = 1000 / fps;
//   const splitTimeMs = splitFrame * msPerFrame;

//   if (original.type === OverlayType.CAPTION) {
//     const originalStartMs = original.from * msPerFrame;
//     const splitOffsetMs = splitTimeMs - originalStartMs;
//     const firstHalfCaptions = original.captions
//       .filter((caption) => caption.startMs < splitOffsetMs)
//       .map((caption) => ({
//         ...caption,
//         endMs: Math.min(caption.endMs, splitOffsetMs),
//         words: caption.words
//           .filter((word) => word.startMs < splitOffsetMs)
//           .map((word) => ({
//             ...word,
//             endMs: Math.min(word.endMs, splitOffsetMs),
//           })),
//       }))
//       .filter((caption) => caption.words.length > 0)
//       .map((caption) => ({
//         ...caption,
//         text: caption.words.map((w) => w.word).join(" "),
//       }));
//     const secondHalfCaptions = original.captions
//       .filter((caption) => caption.endMs > splitOffsetMs)
//       .map((caption) => ({
//         ...caption,
//         startMs: Math.max(0, caption.startMs - splitOffsetMs),
//         endMs: caption.endMs - splitOffsetMs,
//         words: caption.words
//           .filter((word) => word.endMs > splitOffsetMs)
//           .map((word) => ({
//             ...word,
//             startMs: Math.max(0, word.startMs - splitOffsetMs),
//             endMs: word.endMs - splitOffsetMs,
//           })),
//       }))
//       .filter((caption) => caption.words.length > 0)
//       .map((caption) => ({
//         ...caption,
//         text: caption.words.map((w) => w.word).join(" "),
//       }));

//     const firstHalf: CaptionOverlay = {
//       ...original,
//       durationInFrames: firstPartDuration,
//       captions: firstHalfCaptions,
//     };
//     const secondHalf: CaptionOverlay = {
//       ...original,
//       id: newId,
//       from: splitFrame,
//       durationInFrames: secondPartDuration,
//       captions: secondHalfCaptions,
//     };
//     return [firstHalf, secondHalf];
//   }

//   // For non-caption types
//   const firstHalf: Overlay = {
//     ...original,
//     durationInFrames: firstPartDuration,
//   };
//   const secondHalf: Overlay = {
//     ...original,
//     id: newId,
//     from: splitFrame,
//     durationInFrames: secondPartDuration,
//     // Pass start time in seconds for video/sound
//     ...(original.type === OverlayType.VIDEO && {
//       videoStartTime: secondHalfStartTime,
//     }),
//     ...(original.type === OverlayType.SOUND && {
//       startFromSound: secondHalfStartTime,
//     }),
//   };
//   return [firstHalf, secondHalf];
// };

// const wait = async (milliSeconds: number) => {
//   await new Promise<void>((resolve) => {
//     setTimeout(() => {
//       resolve();
//     }, milliSeconds);
//   });
// };

// export const calculateFitDimensions = (
//   assetWidth: number,
//   assetHeight: number
// ): { width: number; height: number; top: number; left: number } => {
//   // Retrieve container dimensions from the useEditor store
//   const { width: containerWidth, height: containerHeight } = useEditor
//     .getState()
//     .getAspectRatioDimensions();

//   const assetRatio = assetWidth / assetHeight;
//   const containerRatio = containerWidth / containerHeight;

//   let width: number;
//   let height: number;

//   if (assetRatio > containerRatio) {
//     // Asset is wider than the container (letterbox)
//     width = containerWidth;
//     height = containerWidth / assetRatio;
//   } else {
//     // Asset is taller than the container (pillarbox) or same ratio
//     height = containerHeight;
//     width = containerHeight * assetRatio;
//   }

//   const top = (containerHeight - height) / 2;
//   const left = (containerWidth - width) / 2;

//   return {
//     width: Math.round(width),
//     height: Math.round(height),
//     top: Math.round(top),
//     left: Math.round(left),
//   };
// };

// export const calculateCenteredLayout = (
//   assetWidth: number,
//   assetHeight: number
// ): { width: number; height: number; top: number; left: number } => {
//   // Retrieve container dimensions from the useEditor store
//   const { width: containerWidth, height: containerHeight } = useEditor
//     .getState()
//     .getAspectRatioDimensions();

//   let finalWidth = assetWidth;
//   let finalHeight = assetHeight;

//   // Check if the asset is larger than the container in either dimension
//   if (assetWidth > containerWidth || assetHeight > containerHeight) {
//     const assetRatio = assetWidth / assetHeight;
//     const containerRatio = containerWidth / containerHeight;

//     // Determine the limiting dimension and scale down
//     if (assetRatio > containerRatio) {
//       // Asset is relatively wider, limited by container width
//       finalWidth = containerWidth;
//       finalHeight = containerWidth / assetRatio;
//     } else {
//       // Asset is relatively taller or same ratio, limited by container height
//       finalHeight = containerHeight;
//       finalWidth = containerHeight * assetRatio;
//     }
//   }

//   // Calculate top and left based on the final (potentially scaled) dimensions
//   const top = (containerHeight - finalHeight) / 2;
//   const left = (containerWidth - finalWidth) / 2;

//   return {
//     width: Math.round(finalWidth),
//     height: Math.round(finalHeight),
//     top: Math.round(top),
//     left: Math.round(left),
//   };
// };

// export const calculateFillDimensions = (
//   assetWidth: number,
//   assetHeight: number
// ): { width: number; height: number; top: number; left: number } => {
//   // Retrieve container dimensions from the useEditor store
//   const { width: containerWidth, height: containerHeight } = useEditor
//     .getState()
//     .getAspectRatioDimensions();

//   console.log({ containerWidth, containerHeight });

//   const assetRatio = assetWidth / assetHeight;
//   const containerRatio = containerWidth / containerHeight;

//   let width: number;
//   let height: number;

//   if (assetRatio > containerRatio) {
//     // Asset is wider than the container, scale based on width to fill
//     width = containerWidth;
//     height = containerWidth / assetRatio;
//   } else {
//     // Asset is taller than the container or same ratio, scale based on height to fill
//     height = containerHeight;
//     width = containerHeight * assetRatio;
//   }

//   // Now, determine the final dimensions to *fill* the container by scaling up the *smaller* dimension
//   let scale: number;
//   if (assetRatio > containerRatio) {
//     // Asset is wider relative to container. Scale by height.
//     scale = containerHeight / assetHeight;
//     width = assetWidth * scale;
//     height = containerHeight;
//   } else {
//     // Asset is taller relative to container or same ratio. Scale by width.
//     scale = containerWidth / assetWidth;
//     width = containerWidth;
//     height = assetHeight * scale;
//   }

//   const top = (containerHeight - height) / 2;
//   const left = (containerWidth - width) / 2;

//   return {
//     width: Math.round(width),
//     height: Math.round(height),
//     top: Math.round(top),
//     left: Math.round(left),
//   };
// };
