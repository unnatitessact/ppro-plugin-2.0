import { Key, ReactNode, useEffect, useMemo, useRef, useState } from 'react';

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { restrictToHorizontalAxis, restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { cn } from '@nextui-org/react';
import { motion } from 'framer-motion';
import { useHotkeys } from 'react-hotkeys-hook';

import { CircleXFilled, ColumnWideAdd, MagnifyingGlass } from '@tessact/icons';

import { ScrollShadow } from '@/components/ui/ScrollShadow';

import { Column } from '@/types/table';

import { Button } from '../ui/Button';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '../ui/Dropdown';
import { Switch } from '../ui/Switch';
import TableColumn from './TableColumn';
import TableRow from './TableRow';

interface TableHeaderAction {
  label: string;
  component: React.ReactNode;
  onAction: () => void;
}

export type RightClickMenuOption = {
  label: React.ReactNode;
  key: string;
  onAction: (id: string) => void;
};

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  selectedData: T[];
  paginationScrollRef?: React.LegacyRef<HTMLDivElement> | null;
  setSelectedData: (data: T[]) => void;
  hasTableHeader: boolean;
  sortColumn?: {
    key: string;
    order: 'asc' | 'desc' | '';
  };
  emptyStateLabel?: string;
  emptyStateBody?: string;
  tableId: string;
  headerContent?: React.ReactNode;
  tableHeaderActions?: TableHeaderAction[];
  tableActions: React.ReactNode;
  setSortColumn?: (data: { key: string; order: 'asc' | 'desc' | '' }) => void;
  isLoading: boolean;
  loadingState: React.ReactNode;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  isRowDragEnabled: boolean;
  isColumnDragEnabled: boolean;
  hasRowActions?: boolean;
  rowActions?: {
    label: string;
    onAction: (id: string) => void;
  }[];
  isSelectionEnabled?: boolean;
  scrollHeight?: number;
  topContent?: {
    key: string;
    content: ReactNode;
  }[];
  tableActionsY?: number;
  onRowClick?: (row: T) => void;
  onRowRightClick?: (row: T) => void;
  hasRightClickMenu?: boolean;
  rightClickMenuOptions?: RightClickMenuOption[] | ((row: T) => RightClickMenuOption[]);
  scrollOffsetBottomPadding?: number;
  emptyStateComponent?: React.ReactNode;
  hideColumnAddButton?: boolean;
  hideTableHead?: boolean;
}

// Add this interface to store column information
interface StoredColumnInfo {
  key: string;
  width: number;
}

const Table = <
  T extends {
    id: string;
  }
>({
  columns,
  data,
  paginationScrollRef,
  selectedData,
  setSelectedData,
  sortColumn,
  setSortColumn,
  hasTableHeader = false,
  tableHeaderActions,
  headerContent,
  tableActions,
  isLoading,
  loadingState,
  searchQuery,
  isRowDragEnabled,
  isColumnDragEnabled,
  onSearchQueryChange,
  hasRowActions = false,
  rowActions,
  isSelectionEnabled = true,
  scrollHeight,
  topContent,
  tableActionsY = 16,
  onRowClick,
  onRowRightClick,
  hasRightClickMenu = false,
  rightClickMenuOptions,
  tableId,
  emptyStateBody,
  emptyStateLabel,
  scrollOffsetBottomPadding,
  emptyStateComponent,
  hideColumnAddButton,
  hideTableHead
}: TableProps<T>) => {
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>(() => {
    if (typeof window !== 'undefined' && tableId) {
      const storedColumns = JSON.parse(
        localStorage.getItem(`table-${tableId}`) || '[]'
      ) as StoredColumnInfo[];

      if (storedColumns.length === 0) {
        return columns.reduce(
          (acc, column) => {
            acc[column.key] = column.minWidth || 100;
            return acc;
          },
          {} as Record<string, number>
        );
      }

      return storedColumns.reduce(
        (acc, col) => {
          acc[col.key] = col.width;
          return acc;
        },
        {} as Record<string, number>
      );
    }
    return {};
  });

  const [visibleColumns, setVisibleColumns] = useState<Column<T>[]>(() => {
    if (typeof window !== 'undefined' && tableId) {
      const storedColumns = JSON.parse(
        localStorage.getItem(`table-${tableId}`) || '[]'
      ) as StoredColumnInfo[];

      if (storedColumns.length === 0) {
        return columns;
      } else {
        const filteredColumns = columns.filter((col) =>
          storedColumns.some((stored) => stored.key === col.key)
        );

        const orderedColumns = storedColumns
          .map((stored) => filteredColumns.find((col) => col.key === stored.key))
          .filter((col): col is Column<T> => col !== undefined);

        return orderedColumns.length > 0 ? orderedColumns : columns;
      }
    }
    return columns;
  });

  const tableContainerRef = useRef<HTMLDivElement>(null);

  const isAllRowsSelected = useMemo(
    () => selectedData.length === data.length && data?.length > 0,
    [selectedData, data]
  );

  const [focusIndex, setFocusIndex] = useState(0);

  // resizing column states

  const handleColumnDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      setVisibleColumns((items) => {
        const oldIndex = items.findIndex((item) => item.key === active.id);
        const newIndex = items.findIndex((item) => item.key === over.id);
        const newColumns = arrayMove(items, oldIndex, newIndex);

        // Store both order and widths
        const columnsToStore: StoredColumnInfo[] = newColumns.map((col) => ({
          key: col.key,
          width: columnWidths[col.key] || col.minWidth || 100
        }));

        localStorage.setItem(`table-${tableId}`, JSON.stringify(columnsToStore));

        return newColumns;
      });
    }
  };

  const handleHide = (columnKey: Key) => {
    if (visibleColumns.find((item) => item.key === columnKey)) {
      // Prevent hiding if it would result in empty columns
      if (visibleColumns.length <= 1) return;
      const newColumns = visibleColumns.filter((item) => item.key !== columnKey);
      // Safety check - if somehow newColumns is empty, keep all columns
      setVisibleColumns(newColumns.length > 0 ? newColumns : columns);

      // Store both order and widths
      const columnsToStore: StoredColumnInfo[] = newColumns.map((col) => ({
        key: col.key,
        width: columnWidths[col.key] || col.minWidth || 100
      }));

      localStorage.setItem(`table-${tableId}`, JSON.stringify(columnsToStore));
    } else {
      const column = columns.find((item) => item.key === columnKey);
      if (column) {
        const newColumns = [...visibleColumns, column];
        setVisibleColumns(newColumns);

        // Store both order and widths
        const columnsToStore: StoredColumnInfo[] = newColumns.map((col) => ({
          key: col.key,
          width: columnWidths[col.key] || col.minWidth || 100
        }));

        localStorage.setItem(`table-${tableId}`, JSON.stringify(columnsToStore));
      }
    }
  };

  const tableHeadRef = useRef<HTMLTableRowElement>(null);

  const headerRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  useEffect(() => {
    const localStorageColumns = JSON.parse(
      localStorage.getItem(`table-${tableId}`) || '[]'
    ) as StoredColumnInfo[];

    if (localStorageColumns.length > 0) {
      const initialWidths = localStorageColumns.reduce(
        (acc, column) => {
          acc[column.key] = column.width;
          return acc;
        },
        {} as Record<string, number>
      );

      setColumnWidths(initialWidths);
    } else {
      const initialWidths = visibleColumns.reduce(
        (acc, column) => {
          acc[column.key] = column.minWidth || 100; // Use 100 as default minWidth if not specified
          return acc;
        },
        {} as Record<string, number>
      );

      setColumnWidths(initialWidths);
    }

    // if

    const storedColumns = localStorage.getItem(`table-${tableId}`);
    if (storedColumns?.length === 0) {
      const parsedColumns = JSON.parse(storedColumns);
      setVisibleColumns(parsedColumns);
    }
  }, [visibleColumns, tableId]);

  // Add an effect to update localStorage when column widths change
  useEffect(() => {
    if (typeof window !== 'undefined' && tableId && visibleColumns.length > 0) {
      const columnsToStore: StoredColumnInfo[] = visibleColumns.map((col) => ({
        key: col.key,
        width: columnWidths[col.key] || col.minWidth || 100
      }));

      localStorage.setItem(`table-${tableId}`, JSON.stringify(columnsToStore));
    }
  }, [columnWidths, visibleColumns, tableId]);

  useHotkeys('up', () => setFocusIndex(Math.max(focusIndex - 1, 0)));
  useHotkeys('down', () => setFocusIndex(Math.min(focusIndex + 1, data.length - 1)));
  useHotkeys('enter', () => {
    if (focusIndex >= 0 && focusIndex < data.length) {
      // onRowClick?.(data[focusIndex]);
      if (selectedData.filter((item: T) => item?.id === data[focusIndex]?.id)?.length) {
        setSelectedData(selectedData.filter((item: T) => item?.id !== data[focusIndex]?.id));
      } else {
        setSelectedData([...selectedData, data[focusIndex]]);
      }
    }
  });

  return (
    <div className={'relative flex h-full min-h-0 flex-col'}>
      <div
        // ref={hotkeysRef as React.RefObject<HTMLDivElement>}
        className={cn(
          'relative flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-ds-table-row-border'
        )}
      >
        {hasTableHeader ? (
          <div className="flex items-center justify-between p-4" ref={headerRef}>
            {headerContent}
            <div className="flex w-fit items-center gap-2">
              {tableHeaderActions?.map((action) => action.component)}
            </div>
          </div>
        ) : null}
        {!hideColumnAddButton && (
          <Dropdown closeOnSelect={false}>
            <DropdownTrigger>
              <Button
                size="lg"
                className={`absolute right-0 top-0 z-50 h-11 rounded-none rounded-tr-xl bg-default-100 ${hasTableHeader ? `top-[${headerRef.current?.clientHeight}px]` : ''}`}
                isIconOnly
                variant="solid"
                aria-label="Add column"
              >
                <ColumnWideAdd className="text-ds-text-secondary" size={20} />
              </Button>
            </DropdownTrigger>
            <DropdownMenu onAction={(key) => handleHide(key)}>
              {columns.map((column) => (
                <DropdownItem
                  key={column.key}
                  endContent={
                    <Switch
                      size="sm"
                      isSelected={
                        visibleColumns?.filter((item) => item.key === column.key).length > 0
                          ? true
                          : false
                      }
                      onValueChange={() => {
                        handleHide(column.key);
                      }}
                    />
                  }
                >
                  {column.label}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        )}

        <DndContext
          collisionDetection={closestCenter}
          modifiers={[restrictToHorizontalAxis]}
          onDragEnd={handleColumnDragEnd}
          sensors={sensors}
        >
          {/* Remove this random value of 200px from scrollbar */}
          <ScrollShadow
            className={cn(
              'flex h-full min-h-0 w-full flex-col rounded-xl',
              ((!isLoading && data.length === 0) || !topContent || topContent?.length === 0) &&
                'h-auto'
            )}
            style={{
              maxHeight: scrollHeight ? `${scrollHeight}px` : undefined //'calc(100vh - 260px)',
            }}
            scrollRestorationKey={`table-${tableId}`}
          >
            <div ref={tableContainerRef} className="relative min-h-0">
              <table
                className="w-full"
                style={{
                  tableLayout: 'fixed',
                  marginBottom: tableActionsY ? `${tableActionsY}px` : '0px'
                }}
              >
                {!hideTableHead && (
                  <thead className="sticky top-0 z-10  bg-default-100">
                    <SortableContext
                      items={visibleColumns?.map((item) => item.key)}
                      strategy={horizontalListSortingStrategy}
                    >
                      <tr className="w-full py-2" ref={tableHeadRef}>
                        {visibleColumns.map((column, index) => (
                          <TableColumn
                            column={column}
                            isSelectionEnabled={isSelectionEnabled}
                            hasTableHeader={hasTableHeader}
                            setVisibleColumns={setVisibleColumns}
                            setSelectedData={setSelectedData}
                            visibleColumns={visibleColumns}
                            key={column.key}
                            isColumnDragEnabled={isColumnDragEnabled}
                            index={index}
                            isAllRowsSelected={isAllRowsSelected}
                            sortColumn={sortColumn}
                            setSortColumn={setSortColumn}
                            data={data}
                            columnWidths={columnWidths}
                            setColumnWidths={setColumnWidths}
                          />
                        ))}
                        {hasRowActions && <td className="w-10" />}
                      </tr>
                    </SortableContext>
                  </thead>
                )}

                {topContent && topContent.length ? (
                  <>
                    {topContent.map((item) => (
                      <tr key={item.key}>
                        <td colSpan={visibleColumns.length}>{item.content}</td>
                      </tr>
                    ))}
                  </>
                ) : null}

                <DndContext
                  collisionDetection={closestCenter}
                  modifiers={[restrictToVerticalAxis]}
                  onDragEnd={() => {}}
                  sensors={sensors}
                >
                  <SortableContext
                    items={data.map((item) => item.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <tbody>
                      {isLoading
                        ? [...Array(5)].map((_, index) => (
                            <tr key={index}>
                              <td colSpan={visibleColumns.length}>{loadingState}</td>
                            </tr>
                          ))
                        : null}
                      {data.length > 0
                        ? data.map((item, index) => (
                            <TableRow
                              key={item.id}
                              hasRightClickMenu={hasRightClickMenu}
                              index={index}
                              setFocusIndex={setFocusIndex}
                              isSelectionEnabled={isSelectionEnabled}
                              focusIndex={focusIndex}
                              hasRowActions={hasRowActions}
                              isRowDragEnabled={isRowDragEnabled}
                              row={item}
                              isLastRow={index === data.length - 1}
                              columns={visibleColumns}
                              selectedData={selectedData}
                              setSelectedData={setSelectedData}
                              isAllRowsSelected={isAllRowsSelected}
                              rowActions={rowActions}
                              onRowClick={onRowClick}
                              onRowRightClick={onRowRightClick}
                              rightClickMenuOptions={rightClickMenuOptions}
                            />
                          ))
                        : null}
                      <div className="h-1 w-full flex-shrink-0" ref={paginationScrollRef} />
                      {!!scrollOffsetBottomPadding && !isLoading && data?.length > 0 && (
                        <div
                          style={{
                            paddingBottom: scrollOffsetBottomPadding
                          }}
                        />
                      )}
                    </tbody>
                  </SortableContext>
                </DndContext>
              </table>
            </div>
          </ScrollShadow>
        </DndContext>

        {!isLoading && data.length === 0 ? (
          <div className="flex h-full w-full items-center justify-center">
            <div className="flex flex-col items-center justify-center gap-2">
              {searchQuery.length ? (
                <>
                  <div className="-z-1 relative">
                    <MagnifyingGlass className="h-10 w-10 text-ds-text-secondary" />
                    <div className="absolute left-0 top-1/2 z-100 -translate-y-1/2">
                      <CircleXFilled size={14} className="text-ds-text-secondary" />
                    </div>
                  </div>

                  <p>No assets matching your search</p>

                  <Button
                    onPress={() => onSearchQueryChange('')}
                    color="secondary"
                    aria-label="Clear search"
                  >
                    Clear search
                  </Button>
                </>
              ) : emptyStateComponent ? (
                emptyStateComponent
              ) : emptyStateLabel ? (
                <div className="flex flex-col items-center justify-center gap-1">
                  <p className="text-lg font-medium text-ds-text-primary"> {emptyStateLabel} </p>
                  <p className="text-sm text-ds-text-secondary"> {emptyStateBody} </p>
                </div>
              ) : (
                <div>No data is present</div>
              )}
            </div>
          </div>
        ) : null}
      </div>

      {tableActions && selectedData.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: tableActionsY ? -tableActionsY : 16 }}
          animate={{ opacity: 1, y: tableActionsY ? tableActionsY : -16 }}
          exit={{ opacity: 0, y: tableActionsY ? -tableActionsY : 16 }}
          transition={{ duration: 0.15 }}
          className={cn(
            'rounded-2xl bg-primary-400 px-4 py-2',
            'flex items-center justify-between gap-5',
            'bg-ds-button-default-bg text-ds-button-default-text',
            'absolute bottom-10 z-50',
            'w-full transition-colors '
          )}
        >
          {tableActions}
        </motion.div>
      ) : null}
    </div>
  );
};

export default Table;
