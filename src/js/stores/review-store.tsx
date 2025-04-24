import type {
  Action,
  Arrow,
  BrushStroke,
  Ellipse,
  Shape,
  ShapeType,
} from "../types/shape";

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { FilterCollection } from "../types/review";

// import { Comment } from '@/types/review';
import {
  ReviewComment,
  ReviewCommentSort,
} from "../api-integration/types/review";

interface ReviewStore {
  selectedComment: ReviewComment | null;
  setSelectedComment: (selectedComment: ReviewComment | null) => void;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  selectedShape: ShapeType;
  setSelectedShape: (shape: ShapeType) => void;
  undoStack: Array<Action>;
  redoStack: Array<Action>;
  undo: () => void;
  redo: () => void;
  drawnShapes: Shape[];
  setDrawnShapes: (shapes: Shape[]) => void;
  appendShape: (shape: Shape) => void;
  handleDrawAction: (shape: Shape) => void;
  handleDeleteAction: (shape: Shape) => void;
  isDrawing: boolean;
  setIsDrawing: (isDrawing: boolean) => void;
  clearState: () => void;
  appliedFilters: FilterCollection;
  setAppliedFilters: (appliedFilters: FilterCollection) => void;
  appliedSort: ReviewCommentSort;
  setAppliedSort: (appliedSort: ReviewCommentSort) => void;

  shouldPlayAfterCommenting: boolean;
  setShouldPlayAfterCommenting: (shouldPlayAfterCommenting: boolean) => void;
  commentToAutoscrollTo: string | null;
  setCommentToAutoscrollTo: (value: string | null) => void;
}

export const useReviewStore = create<ReviewStore>()(
  immer((set, get) => ({
    selectedComment: null,
    setSelectedComment: (selectedComment) => set({ selectedComment }),
    selectedColor: "#F06A6A",
    isTimeInAndTimeOutSelectionEnabled: false,
    setIsTimeInAndTimeOutSelectionEnabled: (
      isTimeInAndTimeOutSelectionEnabled: boolean
    ) =>
      set(() => ({
        isTimeInAndTimeOutSelectionEnabled: isTimeInAndTimeOutSelectionEnabled,
      })),
    setSelectedColor: (color) =>
      set((state) => {
        state.selectedColor = color;
      }),
    selectedShape: "brush",
    setSelectedShape: (shape) =>
      set((state) => {
        state.selectedShape = shape;
      }),
    undoStack: [],
    redoStack: [],
    undo: () => {
      const lastAction = get().undoStack[get().undoStack.length - 1];
      if (lastAction) {
        set((state) => {
          state.redoStack.push(lastAction);
          state.undoStack.splice(state.undoStack.length - 1, 1);
          if (lastAction.action === "create") {
            state.drawnShapes = state.drawnShapes.filter(
              (shape) => shape.id !== lastAction.shapeId
            );
          } else {
            state.drawnShapes.push(lastAction.shape);
          }
        });
      }
    },
    redo: () => {
      const lastAction = get().redoStack[get().redoStack.length - 1];
      if (lastAction) {
        set((state) => {
          state.undoStack.push(lastAction);
          state.redoStack.splice(state.redoStack.length - 1, 1);
          if (lastAction.action === "create") {
            state.drawnShapes.push(lastAction.shape);
          } else {
            state.drawnShapes = state.drawnShapes.filter(
              (shape) => shape.id !== lastAction.shapeId
            );
          }
        });
      }
    },
    drawnShapes: [],
    setDrawnShapes: (shapes) =>
      set((state) => {
        state.drawnShapes = shapes;
      }),
    appendShape: (shape) =>
      set((state) => {
        state.drawnShapes.push(shape);
      }),
    handleDrawAction: (shape) => {
      const action: Action = {
        shapeId: shape.id,
        shapeType: shape.shape,
        action: "create",
        shape,
      };
      set((state) => {
        state.undoStack.push(action);
        state.redoStack = [];
      });
    },
    handleDeleteAction: (shapeToDelete) => {
      set((state) => {
        state.drawnShapes = state.drawnShapes.filter(
          (shape) => shape.id !== shapeToDelete.id
        );
        const action: Action = {
          shapeId: shapeToDelete.id,
          shapeType: shapeToDelete.shape,
          action: "delete",
          shape: shapeToDelete,
        };
        state.undoStack.push(action);
      });
    },
    isDrawing: false,
    setIsDrawing: (isDrawing) =>
      set((state) => {
        state.isDrawing = isDrawing;
      }),
    clearState: () =>
      set((state) => {
        state.selectedShape = "brush";
        state.drawnShapes = [];
        state.undoStack = [];
        state.redoStack = [];
        state.isDrawing = false;
        state.selectedColor = "#F06A6A";
        state.selectedComment = null;
      }),
    appliedFilters: {
      attachments: false,
      unread: false,
      markedDone: false,
      tags: [],
      mentions: [],
      commenter: [],
      createdDate: null,
    },
    setAppliedFilters: (appliedFilters) =>
      set((state) => {
        state.appliedFilters = appliedFilters;
      }),
    appliedSort: "in_time",
    setAppliedSort: (appliedSort) =>
      set((state) => {
        state.appliedSort = appliedSort;
      }),
    shouldPlayAfterCommenting: false,
    setShouldPlayAfterCommenting: (shouldPlayAfterCommenting) =>
      set(() => ({ shouldPlayAfterCommenting: shouldPlayAfterCommenting })),
    commentToAutoscrollTo: null,
    setCommentToAutoscrollTo: (commentToAutoscrollTo) =>
      set(() => ({ commentToAutoscrollTo })),
  }))
);

export type { Action, ShapeType, Ellipse, Arrow, BrushStroke };
