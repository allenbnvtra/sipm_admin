import { useState } from 'react';
import TenantInfo from '../../../components/ui/tenants/TenantInfo';
import MonthlyBill from '../../../components/ui/tenants/MonthlyBill';
import { IoHomeSharp } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { FaCalendarDays } from 'react-icons/fa6';

const BillPerTenantsPage = () => {
  const [activeTab, setActiveTab] = useState<string>('Monthly Bill');
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState<boolean>(false);
  const [selectedYear, setSelectedYear] = useState('2024'); // Default year

  const handleYearSelect = (year: string) => {
    setSelectedYear(year);
    setIsYearDropdownOpen(false); // Close the dropdown after selecting a year
  };

  const getLastThreeYears = (): string[] => {
    const currentYear = new Date().getFullYear();
    return [currentYear, currentYear - 1, currentYear - 2, currentYear - 3].map(
      String
    );
  };

  const years = getLastThreeYears();

  return (
    <div className='sm:px-[6rem] md:px-0 lg:px-[2rem] xl:px-[6rem] mb-[-12px]'>
      <p className='text-xs text-slate-700 flex gap-2'>
        <Link to='/dashboard'>
          <IoHomeSharp size={15} />
        </Link>
        /<Link to='/tenants'>Tenants</Link>/
        <span className='text-green-600'>Monthly bill</span>
      </p>

      <div className='md:flex gap-6 mt-3'>
        <TenantInfo />

        {/* SECOND DIV */}
        <div className='md:w-[70%] rounded-t-md border border-slate-200 bg-white shadow-md flex flex-col max-h-[87vh] overflow-hidden h-[90vh] xxl:h-[100vh] '>
          <div className='flex justify-between items-center text-slate-900 border-b px-1 border-b-slate-200 shadow-md'>
            <div className='flex items-center'>
              <p
                className={`text-md font-medium py-3 px-3 relative cursor-pointer ${
                  activeTab === 'Monthly Bill' ? 'text-indigo-900' : ''
                }`}
                onClick={() => setActiveTab('Monthly Bill')}
              >
                Monthly Bill
                {activeTab === 'Monthly Bill' && (
                  <span className='absolute left-0 bottom-0 w-full h-[4px] rounded-full bg-indigo-900'></span>
                )}
              </p>
              <p
                className={`text-md font-medium py-3 px-3 relative cursor-pointer ${
                  activeTab === 'Transactions' ? 'text-indigo-900' : ''
                }`}
                onClick={() => setActiveTab('Transactions')}
              >
                Transactions
                {activeTab === 'Transactions' && (
                  <span className='absolute left-0 bottom-0 w-full h-[4px] rounded-full bg-indigo-900'></span>
                )}
              </p>
            </div>

            {activeTab === 'Monthly Bill' && (
              <div className='relative'>
                <p
                  onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
                  className='flex items-center gap-2 pr-4 cursor-pointer text-md font-semibold text-indigo-900 hover:text-indigo-700'
                >
                  <FaCalendarDays size={16} /> {selectedYear}
                </p>
                {isYearDropdownOpen && (
                  <div className='absolute top-6 right-3 bg-white border-slate-100 border shadow-md rounded-md text-slate-800 text-sm'>
                    {years.map((year) => (
                      <p
                        key={year}
                        className='px-7 py-1 cursor-pointer hover:bg-slate-100 transition-all'
                        onClick={() => handleYearSelect(year)}
                      >
                        {year}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className='overflow-y-auto scrollbar-hide'>
            {activeTab === 'Monthly Bill' ? (
              <MonthlyBill year={selectedYear} />
            ) : (
              <div>Transaction</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillPerTenantsPage;
