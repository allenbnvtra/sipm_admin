import { BsReceipt, BsSpeedometer } from 'react-icons/bs';
import { IoPersonOutline } from 'react-icons/io5';
import { MdOutlinePlace, MdPayment } from 'react-icons/md';
import { GrTransaction } from 'react-icons/gr';
import { formatBillingPeriod, formatCurrency } from '../../../../helpers';
import { FiArchive } from 'react-icons/fi';

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
    amountPerConsumption: number;
    totalConsumption: number;
    currentBill: number;
    remainingBalance: number;
  };
  openPaymentModal: () => void;
  openTransactionModal: () => void;
  openArchiveModal: () => void;
}

const MonthlyBill = ({
  data,
  openPaymentModal,
  openTransactionModal,
  openArchiveModal,
}: MonthlyBillProps) => {
  let totalCurrentBill = 0;

  if (data?.amountPerConsumption === 0) {
    totalCurrentBill = 12;
  } else {
    totalCurrentBill = data?.amountPerConsumption;
  }

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
                ? data.previousReading.toFixed(2)
                : 'N/A'}
            </span>
          </p>
          <p className='flex flex-col items-center'>
            Current(kWh)
            <span className='font-semibold'>
              {data?.currentReading !== undefined
                ? data.currentReading.toFixed(2)
                : 'N/A'}
            </span>
          </p>
          <p className='flex flex-col items-center'>
            Actual Consumption(kWh)
            <span className='font-semibold'>
              {data?.totalConsumption !== undefined
                ? data.totalConsumption.toFixed(2)
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
                ? formatCurrency(totalCurrentBill * data.totalConsumption)
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

        <div className='flex flex-wrap-reverse justify-center mt-5 gap-1 text-sm'>
          <button
            onClick={openArchiveModal}
            className='text-white px-3 py-2 rounded-lg font-medium flex items-center gap-1 button-red-gradient'
          >
            <FiArchive size={18} />
            Delete
          </button>
          {data?.remainingBalance && data?.remainingBalance > 0 ? (
            <button
              onClick={openPaymentModal}
              className='text-white px-3 py-2 rounded-lg font-medium flex items-center gap-1 button-green-gradient'
            >
              <MdPayment size={18} />
              Payment
            </button>
          ) : (
            <></>
          )}
          <button
            onClick={openTransactionModal}
            className='text-white px-3 py-2 rounded-lg font-medium flex items-center gap-1 button-gradient'
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
