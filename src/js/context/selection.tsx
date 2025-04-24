import React, { createContext, useContext } from "react";

import { DrawnArea, useAreaSelection } from "../hooks/useAreaSelection";

interface SelectionContextProps {
  selection: DOMRect | null;
  drawArea: DrawnArea;
  mouseDown: boolean;
}

const SelectionContext = createContext<SelectionContextProps>({
  selection: null,
  drawArea: { start: undefined, end: undefined },
  mouseDown: false,
});

export const useSelectionContext = () => useContext(SelectionContext);

export const SelectionProvider = ({
  children,
  selectionContainerRef,
  containerIds,
}: {
  children: React.ReactNode;
  selectionContainerRef: React.RefObject<HTMLElement> | undefined;
  containerIds: string[];
}) => {
  const { selection, drawArea, mouseDown } = useAreaSelection({
    container: selectionContainerRef,
    containerIds,
  });
  return (
    <SelectionContext.Provider
      value={{
        drawArea,
        mouseDown,
        selection,
      }}
    >
      {children}
    </SelectionContext.Provider>
  );
};
