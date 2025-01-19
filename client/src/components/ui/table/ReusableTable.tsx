import { ReactNode } from 'react';

interface Column<T> {
  key: keyof T;
  label: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
}

const Table = <T,>({ columns, data, onRowClick }: TableProps<T>) => {
  const renderCellContent = (value: T[keyof T]): ReactNode => {
    if (typeof value === 'string' || typeof value === 'number') {
      return value;
    }
    return String(value);
  };

  return (
    <div className='overflow-x-auto'>
      <table className='min-w-full table-auto border-collapse border border-gray-300'>
        <thead>
          <tr className='bg-gray-100'>
            {columns.map((col) => (
              <th
                key={col.key as string}
                className='border border-gray-300 px-4 py-2 text-left text-gray-600'
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              onClick={() => onRowClick?.(row)}
              className={`hover:bg-gray-50 ${
                onRowClick ? 'cursor-pointer' : ''
              }`}
            >
              {columns.map((col) => (
                <td
                  key={col.key as string}
                  className='border border-gray-300 px-4 py-2'
                >
                  {renderCellContent(row[col.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
