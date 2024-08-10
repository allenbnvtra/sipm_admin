import { useState } from 'react';

interface FilterProps {
  onFilterChange: (filter: string) => void;
}

const Filter: React.FC<FilterProps> = ({ onFilterChange }) => {
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const filterMap: { [key: string]: string } = {
    ID: '_id',
    Name: 'name',
    'Stall No.': 'stallNo',
    Username: 'email',
    Balance: 'remainingBalance',
  };

  const handleFilterClick = (filter: string) => {
    setSelectedFilter(filter);
    onFilterChange(filterMap[filter]);
  };

  return (
    <div className='absolute right-[2px] top-[30px] z-[100] w-40 rounded-md border border-slate-200 bg-white shadow-md'>
      <p className='px-4 py-2 text-xs font-semibold text-slate-800'>Sort By:</p>
      {Object.keys(filterMap).map((filter) => (
        <p
          key={filter}
          className={`filter_dropdown ${
            selectedFilter === filter ? 'bg-gray-200' : ''
          }`}
          onClick={() => handleFilterClick(filter)}
        >
          {filter}
        </p>
      ))}
    </div>
  );
};

export default Filter;
