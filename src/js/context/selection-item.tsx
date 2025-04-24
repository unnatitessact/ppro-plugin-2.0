import { useSelectionContext } from '@/context/selection';

import { useSelected } from '@/hooks/useAreaSelection';

export const SelectionItemWrapper = ({
  children,
  boxRef,
  isSelected,
  handleSelected
}: {
  children: React.ReactNode;
  boxRef: React.RefObject<HTMLDivElement>;
  isSelected: boolean;
  handleSelected: (isSelectedValue: boolean) => void;
}) => {
  const { selection, drawArea } = useSelectionContext();

  useSelected(boxRef, selection, drawArea, isSelected, handleSelected);

  return children;
};
