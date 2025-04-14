import { useEffect } from 'react';

import { cn } from '@nextui-org/react';
import { flexRender, Row as RowType } from '@tanstack/react-table';
import { motion } from 'framer-motion';
import { Cell, Row } from 'react-aria-components';

import { Checkbox } from '@/components/ui/Checkbox';

interface DataTableRowProps<T extends object> {
  row: RowType<T>;
  isRowSelected: boolean;
  onValueChange: (value: boolean) => void;
  isSomeRowsSelected: boolean;
  setSelectedData: (data: T[]) => void;
  selectedData: T[];
  isSelectionEnabled: boolean;
  isHoverEnabled: boolean | undefined;
}

export const DataTableRow = <T extends { id: string }>({
  row,
  isRowSelected,
  onValueChange,
  isSomeRowsSelected,
  setSelectedData,
  selectedData,
  isSelectionEnabled,
  isHoverEnabled
}: DataTableRowProps<T>) => {
  useEffect(() => {
    if (isRowSelected) {
      const newData = [...selectedData, row.original]; // Assuming row.original is of type T or T[]
      setSelectedData(newData);
    } else {
      const filteredData = selectedData.filter((item) => item.id !== row.original.id); // You need to have access to `prev` here
      setSelectedData(filteredData);
    }
  }, [isRowSelected]);

  return (
    <Row
      key={row.id}
      className={cn('rounded-e-xl border-x border-ds-table-row-border', {
        'bg-ds-table-row-bg-selected': isRowSelected,
        'hover:bg-default-100': !isRowSelected && isHoverEnabled
      })}
    >
      {row.getVisibleCells().map((cell, index) => (
        <Cell className={'border-b border-ds-table-row-border p-6'} key={cell.id}>
          {isSelectionEnabled ? (
            <motion.div
              initial={{
                x: 10,
                opacity: 0
              }}
              animate={{
                x: 0,
                opacity: 1,
                transition: {
                  duration: 0.3
                }
              }}
              exit={{
                x: -10,
                opacity: 0
              }}
              className="group relative flex items-center gap-2"
            >
              {index === 0 && isSomeRowsSelected ? (
                <Checkbox onValueChange={onValueChange} isSelected={isRowSelected} />
              ) : null}

              {index === 0 && !isSomeRowsSelected ? (
                <div className="absolute left-0 top-1/2 hidden -translate-y-1/2  group-hover:block">
                  <Checkbox onValueChange={onValueChange} />
                </div>
              ) : null}
              <div
                className={cn(
                  !isSomeRowsSelected && index === 0
                    ? 'transition-all duration-200 group-hover:translate-x-8'
                    : ''
                )}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </div>
            </motion.div>
          ) : (
            <div
              className={cn(
                !isSomeRowsSelected && index === 0
                  ? 'transition-all duration-200 group-hover:translate-x-8'
                  : ''
              )}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </div>
          )}
        </Cell>
      ))}
    </Row>
  );
};
