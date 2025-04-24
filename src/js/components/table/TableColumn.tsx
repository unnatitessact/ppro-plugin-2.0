import { useCallback } from 'react';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useMediaQuery, useMergedRef } from '@mantine/hooks';
import { cn } from '@nextui-org/react';
import { motion } from 'framer-motion';
import { PiDotsSixVerticalLight } from 'react-icons/pi';

import { ChevronBottom, ChevronTop } from '@tessact/icons';

import { Column } from '@/types/table';

import { MOBILE_MEDIA_QUERY } from '@/utils/responsiveUtils';

import { Checkbox } from '../ui/Checkbox';
import ResizeHandle from './ResizeHandle';

interface TableColumnProps<T> {
  column: Column<T>;
  index: number;
  isAllRowsSelected: boolean;
  setSelectedData: (data: T[]) => void;
  data: T[];
  sortColumn?: {
    key: string;
    order: 'asc' | 'desc' | '';
  };
  setSortColumn?: (data: { key: string; order: 'asc' | 'desc' | '' }) => void;
  visibleColumns: Column<T>[];
  hasTableHeader: boolean;
  isColumnDragEnabled: boolean;
  isSelectionEnabled: boolean;
  setVisibleColumns: (data: Column<T>[]) => void;
  columnWidths: Record<string, number>;
  setColumnWidths: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}

const TableColumn = <T,>({
  column,
  index,
  hasTableHeader,
  isAllRowsSelected,
  setSelectedData,
  data,
  sortColumn,
  setSortColumn,
  visibleColumns,
  isColumnDragEnabled,
  isSelectionEnabled = true,
  columnWidths,
  setColumnWidths
}: TableColumnProps<T>) => {
  const handleResize = useCallback(
    (width: number) => {
      setColumnWidths((prev) => ({ ...prev, [column.key]: width }));
    },
    [column.key, setColumnWidths]
  );

  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);

  const { attributes, isDragging, listeners, setNodeRef, transform } = useSortable({
    id: column.key
  });

  const mergedRef = useMergedRef(setNodeRef);

  const style = {
    opacity: isDragging ? 0.8 : 1,
    position: 'relative' as React.CSSProperties['position'],
    transform: CSS.Translate.toString(transform),
    transition: 'width transform 0.2s ease-in-out' as React.CSSProperties['transition'],
    whiteSpace: 'nowrap',
    zIndex: isDragging ? 1 : 0
  };

  return (
    <th
      style={{
        ...style,
        width: columnWidths[column.key] || column.minWidth || 'auto',
        minWidth: column.minWidth || 50,
        maxWidth: column.maxWidth || 'none',
        position: 'relative'
        // width: visibleColumns[index]?.width ?? 'auto'
      }}
      key={column.key}
      ref={mergedRef}
      className={cn(
        'group relative text-sm font-medium text-ds-text-secondary',
        'overflow-hidden',
        !hasTableHeader && index === 0 && 'rounded-tl-xl',
        !hasTableHeader && index === visibleColumns.length - 1 && 'rounded-tr-xl'
      )}
    >
      <motion.div
        initial={{
          opacity: 0,
          x: 10
        }}
        animate={{
          opacity: 1,
          x: 0,
          transition: {
            duration: 0.2,
            ease: 'easeInOut'
          }
        }}
        exit={{
          opacity: 0,
          x: 10,
          transition: {
            duration: 0.2,
            ease: 'easeInOut'
          }
        }}
        className="flex justify-between overflow-hidden px-4"
        onContextMenu={(e) => {
          e.preventDefault();
        }}
      >
        <div className="truncate">
          <div className="flex items-center gap-3 py-3">
            {isColumnDragEnabled ? (
              <PiDotsSixVerticalLight className="cursor-pointer" {...attributes} {...listeners} />
            ) : isMobile ? null : (
              <div className="h-4 w-4" />
            )}
            {isSelectionEnabled && index === 0 && (
              <Checkbox
                isSelected={isAllRowsSelected}
                size={'sm'}
                onValueChange={() => {
                  if (isAllRowsSelected) {
                    setSelectedData([]);
                  } else {
                    setSelectedData(data);
                  }
                }}
              />
            )}

            {column.header}

            {column.isSortable ? (
              <div
                className="flex flex-col"
                onClick={() => {
                  if (sortColumn?.key === column.key) {
                    setSortColumn?.({
                      key: column.key,
                      order: sortColumn.order === 'asc' ? 'desc' : 'asc'
                    });
                  } else {
                    setSortColumn?.({ key: column.key, order: 'asc' });
                  }
                }}
              >
                <ChevronTop
                  size={10}
                  className={cn(
                    'cursor-pointer text-default-300',
                    sortColumn?.key === column.key &&
                      sortColumn.order === 'asc' &&
                      'text-default-200'
                  )}
                />
                <ChevronBottom
                  size={10}
                  className={cn(
                    'cursor-pointer text-default-300',
                    sortColumn?.key === column.key &&
                      sortColumn.order === 'desc' &&
                      'text-default-200'
                  )}
                />
              </div>
            ) : null}
          </div>
        </div>
      </motion.div>
      {column.isResizable && (
        <ResizeHandle
          onResize={handleResize}
          minWidth={column.minWidth || 50}
          maxWidth={column.maxWidth || 500}
        />
      )}
    </th>
  );
};

export default TableColumn;
