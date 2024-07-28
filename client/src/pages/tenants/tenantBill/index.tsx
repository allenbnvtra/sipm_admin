import { useState } from 'react';
import TenantInfo from '../../../components/ui/tenants/TenantInfo';
import MonthlyBill from '../../../components/ui/tenants/MonthlyBill';
import { IoHomeSharp } from 'react-icons/io5';
import { Link } from 'react-router-dom';

const BillPerTenantsPage = () => {
  const [activeTab, setActiveTab] = useState('Monthly Bill');
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
        <div className='md:w-[70%] rounded-t-md border border-slate-200 bg-white shadow-md flex flex-col max-h-[87vh] overflow-hidden h-[90vh] '>
          <div className='flex items-center text-slate-900 border-b px-1 border-b-slate-200 shadow-md'>
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

          <div className='overflow-y-auto scrollbar-hide'>
            {activeTab === 'Monthly Bill' ? (
              <div>
                <MonthlyBill />
                <MonthlyBill />
                <MonthlyBill />
                <MonthlyBill />
                <MonthlyBill />
                <MonthlyBill />
                <MonthlyBill />
                <MonthlyBill />
                <MonthlyBill />
                <MonthlyBill />
                <MonthlyBill />
                <MonthlyBill />
              </div>
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
