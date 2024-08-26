import { BsReceipt, BsSpeedometer } from 'react-icons/bs';
import { IoPersonOutline } from 'react-icons/io5';
import { MdOutlinePlace, MdPayment } from 'react-icons/md';
import { GrTransaction } from 'react-icons/gr';
import { formatBillingPeriod, formatCurrency } from '../../../../helpers';

interface MonthlyBillProps {
  data?: {
    user: {
      name: string;
      stallNumber: string;
    };
    meterNumber: string;
    billingPeriod: Date;
    previousReading: number;
    currentReading: number;
    totalConsumption: number;
    currentBill: number;
    remainingBalance: number;
  };
  openPaymentModal: () => void;
  openTransactionModal: () => void;
}

const MonthlyBill = ({
  data,
  openPaymentModal,
  openTransactionModal,
}: MonthlyBillProps) => {
  return (
    <div>
      {/* TENANT INFO */}
      <div className='flex items-center my-4'>
        <span className='border-b border-slate-300 flex-grow'></span>
        <span className='mx-4 text-sm text-slate-500'>Tenant Info</span>
        <span className='border-b border-slate-300 flex-grow'></span>
      </div>

      <div className='text-sm text-slate-700'>
        <p className='text-lg font-semibold flex items-center gap-2'>
          <IoPersonOutline size={16} /> {data?.user.name || 'N/A'}
        </p>
        <p className='flex items-center gap-2'>
          <MdOutlinePlace size={16} />
          {data?.user.stallNumber || 'N/A'}
        </p>
        <p className='flex items-center gap-2'>
          <BsSpeedometer size={16} />
          {data?.meterNumber || 'N/A'}
        </p>
        <p className='flex items-center gap-2'>
          <BsReceipt size={16} />
          Billing statement for{' '}
          <span className='font-semibold'>
            {data?.billingPeriod
              ? formatBillingPeriod(new Date(data.billingPeriod))
              : 'N/A'}
          </span>
        </p>

        {/* METER READING */}
        <div className='flex items-center my-4'>
          <span className='border-b border-slate-300 flex-grow'></span>
          <span className='mx-4 text-sm text-slate-500'>Meter Reading</span>
          <span className='border-b border-slate-300 flex-grow'></span>
        </div>

        <div className='md:flex justify-evenly'>
          <p className='flex flex-col items-center'>
            Previous(kWh)
            <span className='font-semibold'>
              {data?.previousReading !== undefined
                ? data.previousReading
                : 'N/A'}
            </span>
          </p>
          <p className='flex flex-col items-center'>
            Current(kWh)
            <span className='font-semibold'>
              {data?.currentReading !== undefined ? data.currentReading : 'N/A'}
            </span>
          </p>
          <p className='flex flex-col items-center'>
            Final Reading(kWh)
            <span className='font-semibold'>
              {data?.totalConsumption !== undefined
                ? data.totalConsumption
                : 'N/A'}
            </span>
          </p>
        </div>

        {/* BALANCE */}
        <div className='flex items-center my-4'>
          <span className='border-b border-slate-300 flex-grow'></span>
          <span className='mx-4 text-sm text-slate-500'>Balance</span>
          <span className='border-b border-slate-300 flex-grow'></span>
        </div>

        <div className='flex justify-evenly'>
          <p className='flex flex-col items-center'>
            Current
            <span className='font-semibold'>
              {data?.currentBill !== undefined
                ? formatCurrency(data.currentBill)
                : 'N/A'}
            </span>
          </p>
          <p className='flex flex-col items-center'>
            Remaining
            <span className='font-semibold'>
              {data?.remainingBalance !== undefined
                ? formatCurrency(data.remainingBalance)
                : 'N/A'}
            </span>
          </p>
        </div>

        <div className='flex justify-center mt-5 gap-2 text-sm'>
          {data?.remainingBalance && data?.remainingBalance > 0 ? (
            <button
              onClick={openPaymentModal}
              className='text-white px-8 py-2 rounded-full font-medium flex items-center gap-1 button-green-gradient'
            >
              <MdPayment size={18} />
              Payment
            </button>
          ) : (
            <></>
          )}
          <button
            onClick={openTransactionModal}
            className='text-white px-8 py-2 rounded-full font-medium flex items-center gap-1 button-gradient'
          >
            <GrTransaction size={16} />
            Transactions
          </button>
        </div>
      </div>
    </div>
  );
};

export default MonthlyBill;
