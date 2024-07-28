import { FaClock } from 'react-icons/fa';
import { MdOutlineEventNote } from 'react-icons/md';

const MonthlyBill = () => {
  return (
    <div className='cursor-pointer hover:bg-slate-50 transition-all'>
      <div className='flex justify-between items-center p-3 bg-slate-200 text-xs'>
        <p className='font-semibold text-md text-indigo-900 flex items-center gap-1'>
          <MdOutlineEventNote className='text-lg' /> January 2024
        </p>
        <p className='text-green-600'>Details &gt;</p>
      </div>

      <div className='px-5 py-7 grid md:grid-cols-4 gap-4 grid-cols-2'>
        <div className='text-xs flex flex-col items-center'>
          <p className='mb-1 text-md font-semibold text-slate-600'>Status</p>
          <p className='bg-red-200 text-red-900 font-medium text-center py-2 rounded-full flex justify-center items-center px-4 gap-1'>
            <FaClock /> Unpaid
          </p>
        </div>
        <div className='text-xs flex flex-col items-center'>
          <p className='mb-1 text-md font-semibold text-slate-600'>
            Meter Number
          </p>
          <p className='py-[2px] text-slate-800'>320j093428098</p>
        </div>
        <div className='text-xs flex flex-col items-center'>
          <p className='mb-1 text-md font-semibold text-slate-600'>
            Amount Paid
          </p>
          <p className='py-[2px] text-slate-800'>P 10,300.99</p>
        </div>
        <div className='text-xs flex flex-col items-center'>
          <p className='mb-1 text-md font-semibold text-slate-600'>
            Remaining Balance
          </p>
          <p className='py-[2px] text-slate-800'>P 2,299.00</p>
        </div>
      </div>
    </div>
  );
};

export default MonthlyBill;
