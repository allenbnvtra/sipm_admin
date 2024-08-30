import { MdOutlineAccountBalanceWallet } from 'react-icons/md';
import { formatBillingPeriod, formatCurrency } from '../../../../helpers';

interface PaymentProps {
  data?: {
    billingPeriod?: Date;
    remainingBalance?: number;
    currentBill?: number;
  };
  closePaymentModal: () => void;
}

const Payment = ({ data, closePaymentModal }: PaymentProps) => {
  return (
    <div>
      <div className='flex justify-between items-center mb-4'>
        <button onClick={closePaymentModal} className='text-sm text-slate-500'>
          ← Back
        </button>
        <h2 className='text-lg font-semibold text-slate-700'>
          {data?.billingPeriod
            ? formatBillingPeriod(new Date(data.billingPeriod))
            : 'N/A'}
        </h2>
      </div>

      {/* Payment form */}
      <div className='flex justify-between mb-3 items-center'>
        <p className='mb-2 text-sm text-center text-slate-800 flex gap-1 items-center'>
          <MdOutlineAccountBalanceWallet size={20} />
          <span className='font-semibold'>
            {data?.remainingBalance !== undefined
              ? formatCurrency(data.remainingBalance)
              : 'N/A'}
          </span>
        </p>
        <input
          type='date'
          name='paymentDate'
          id='paymentDate'
          className='px-2 text-sm border-b border-gray-400 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-transparent'
          placeholder='mm/dd/yyyy'
          pattern='\d{2}/\d{2}/\d{4}'
        />
      </div>

      <div className='text-center text-sm text-slate-700'>
        {data?.remainingBalance && data?.remainingBalance > 0 ? (
          <div>
            {/* Container for Flexbox Layout */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              {/* First Row */}
              <div>
                <label className='block mb-2'>Payment Amount</label>
                <input
                  type='number'
                  name='paymentAmount'
                  id='paymentAmount'
                  className='w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-transparent'
                  style={{ appearance: 'textfield' }}
                  placeholder='Amount'
                />
              </div>
              <div>
                <label className='block mb-2'>Receipt No</label>
                <input
                  type='text'
                  name='receiptNo'
                  id='receiptNo'
                  className='w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-transparent'
                  placeholder='Receipt Number'
                />
              </div>

              {/* Second Row */}
            </div>
            <div>
              <label className='block my-2'>Note</label>
              <textarea
                name='note'
                id='note'
                rows={4}
                className='w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-transparent'
                placeholder='Additional notes...'
              />
            </div>

            <br />
            <button className='bg-green-600 text-white px-8 py-2 rounded-full font-medium button-green-gradient'>
              Proceed
            </button>
          </div>
        ) : (
          <div className='flex justify-center'>
            <h1 className='bg-green-200 text-green-800 px-5 py-1 rounded-full'>
              Fully Paid
            </h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment;
