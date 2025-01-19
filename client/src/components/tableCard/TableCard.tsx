import { ReactNode, useState } from 'react';
import {
  FaChevronDown,
  FaChevronUp,
  FaSort,
  FaSortUp,
  FaSortDown,
} from 'react-icons/fa';

interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
}

interface TableCardProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  onSort?: (key: keyof T, direction: 'asc' | 'desc') => void;
}

const TableCard = <T,>({
  columns,
  data,
  onRowClick,
  onSort,
}: TableCardProps<T>) => {
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [sortState, setSortState] = useState<{
    key: keyof T;
    direction: 'asc' | 'desc';
  } | null>(null);

  const toggleRowExpansion = (rowIndex: number) => {
    setExpandedRows((prev) =>
      prev.includes(rowIndex)
        ? prev.filter((i) => i !== rowIndex)
        : [...prev, rowIndex]
    );
  };

  const handleSort = (col: Column<T>) => {
    if (!col.sortable) return;
    const newDirection =
      sortState?.key === col.key && sortState.direction === 'asc'
        ? 'desc'
        : 'asc';
    setSortState({ key: col.key, direction: newDirection });
    onSort?.(col.key, newDirection);
  };

  const renderCellContent = (value: T[keyof T]): ReactNode => {
    if (typeof value === 'string' || typeof value === 'number') {
      return value;
    }
    return String(value);
  };

  return (
    <div>
      {/* HEADER ROW */}
      <div className='flex bg-white border border-slate-200 shadow-md text-slate-600 text-sm rounded-lg w-full my-5'>
        {columns.map((col) => (
          <div
            className='flex items-center w-full py-5 px-4 cursor-pointer'
            key={col.key as string}
            onClick={() => handleSort(col)}
          >
            <span className='flex items-center gap-2'>
              {col.label}
              {col.sortable && (
                <span>
                  {sortState?.key === col.key ? (
                    sortState.direction === 'asc' ? (
                      <FaSortUp className='text-slate-500' />
                    ) : (
                      <FaSortDown className='text-slate-500' />
                    )
                  ) : (
                    <FaSort className='text-slate-400' />
                  )}
                </span>
              )}
            </span>
          </div>
        ))}
      </div>

      {/* CARDS ROWS */}
      <div>
        {data.map((row, rowIndex) => {
          const isExpanded = expandedRows.includes(rowIndex);
          return (
            <div
              key={rowIndex}
              onClick={() => onRowClick?.(row)}
              className={`bg-white flex flex-col hover:bg-gray-50 border border-slate-200 shadow-md text-slate-600 text-sm rounded-lg mt-3 ${
                onRowClick ? 'cursor-pointer' : ''
              }`}
            >
              <div className='w-full flex'>
                {/* Card Content */}
                {columns.map((col) => (
                  <div
                    className='flex items-start px-4 py-10 w-full'
                    key={col.key as string}
                  >
                    <div>{renderCellContent(row[col.key])}</div>
                  </div>
                ))}

                {/* Arrow for Shrinkable/Expandable */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleRowExpansion(rowIndex);
                  }}
                  className='ml-auto px-4 py-4 text-gray-500'
                >
                  {isExpanded ? (
                    <FaChevronUp className='w-5 h-5' />
                  ) : (
                    <FaChevronDown className='w-5 h-5' />
                  )}
                </button>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className='w-full px-4 py-4 bg-gray-100'>
                  <p className='text-gray-500 text-sm'>
                    Additional details about this row can go here.
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TableCard;
