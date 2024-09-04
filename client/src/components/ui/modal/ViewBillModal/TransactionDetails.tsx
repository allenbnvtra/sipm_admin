import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../../../utils/axiosInstance';
import { formatBillingPeriod, formatDate } from '../../../../helpers';
import { FiArchive, FiPrinter } from 'react-icons/fi';

interface TransactionDetailsProps {
  transactionId: string | null;
  closeTransactionDetails: () => void;
}

interface Result {
  user: {
    userId: string;
    name: string;
    email: string;
    stallNumber: string;
  };
  bill: {
    billId: string;
    billingPeriod: Date;
    totalConsumption: number;
    amountPerConsumption: number;
    currentBill: number;
  };
  receiptNumber: string;
  paymentAmount: number;
  note: string;
  balance: number;
  paymentDate: Date;
  previousBalance: number;
}

interface FetchResult {
  status: string;
  result: Result;
}

const fetchTransaction = async (transactionId: string): Promise<Result> => {
  const { data } = await axiosInstance.get<FetchResult>(
    `/api/v1/transactions/${transactionId}`
  );

  return data.result;
};

const TransactionDetails = ({
  transactionId,
  closeTransactionDetails,
}: TransactionDetailsProps) => {
  const { data, isLoading, isError, error } = useQuery<Result>({
    queryKey: ['transaction', transactionId],
    queryFn: () => fetchTransaction(transactionId || ''),
    enabled: !!transactionId,
  });

  if (isLoading) {
    return (
      <div className='flex justify-center items-center'>
        <p>Loading...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='flex justify-center items-center'>
        <p className='text-red-500'>
          Error:{' '}
          {error instanceof Error
            ? error.message
            : 'An error occurred while fetching the transaction details.'}
        </p>
        <button
          onClick={closeTransactionDetails}
          className='text-sm text-gray-500 ml-4'
        >
          ← Back
        </button>
      </div>
    );
  }

  if (data) {
    return (
      <div>
        <div className='flex justify-between items-center mb-4'>
          <button
            onClick={closeTransactionDetails}
            className='text-sm text-gray-500'
          >
            ← Back
          </button>
        </div>

        <div className='flex justify-center'>
          <div className='bg-white border p-4 rounded shadow-lg max-w-md font-mono md:mx-5 w-[20rem] max-h-[30rem] overflow-hidden overflow-y-auto scrollbar-hide'>
            {/* Receipt Header */}
            <div className='text-center mb-4'>
              <h2 className='text-xl font-bold'>Cash Invoice</h2>
              <p className='text-xs text-gray-500'>
                San Ildefonso Public Market
              </p>
            </div>

            {/* Tenant Info */}
            <div className='mb-4 text-xs'>
              <div className='flex items-center my-4'>
                <span className='border-b border-dashed border-slate-300 flex-grow'></span>
                <span className='mx-4 text-sm text-slate-500'>
                  Billing Info
                </span>
                <span className='border-b border-dashed border-slate-300 flex-grow'></span>
              </div>
              <div>
                <div className='flex justify-between'>
                  <p className='text-slate-700 font-semibold'>Name</p>
                  <p>{data.user.name}</p>
                </div>
                <div className='flex justify-between'>
                  <p className='text-slate-700 font-semibold'>Username</p>
                  <p>{data.user.email}</p>
                </div>
                <div className='flex justify-between'>
                  <p className='text-slate-700 font-semibold'>Stall number</p>
                  <p>{data.user.stallNumber}</p>
                </div>
                <div>
                  <div className='flex justify-between'>
                    <p className='text-slate-700 font-semibold'>
                      Billing period
                    </p>
                    {formatBillingPeriod(data.bill.billingPeriod)}
                  </div>
                </div>
                <div>
                  <div className='flex justify-between'>
                    <p className='text-slate-700 font-semibold'>Consumption</p>
                    <p>{data.bill.totalConsumption.toFixed(2)} kWh</p>
                  </div>
                </div>
                <div>
                  <div className='flex justify-between'>
                    <p className='text-slate-700 font-semibold'>Rate per kWh</p>
                    <p>
                      {data.bill.amountPerConsumption <= 0
                        ? 'PHP 12'
                        : 'PHP ' + data.bill.amountPerConsumption.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className='text-xs mt-6'>
                  <div className='flex justify-between'>
                    <p className='text-slate-700 font-semibold'>Computation</p>
                    <p>
                      {data.bill.amountPerConsumption <= 0
                        ? data.bill.totalConsumption.toFixed(2) + ' x 12.00'
                        : data.bill.totalConsumption.toFixed(2) +
                          ' x ' +
                          data.bill.amountPerConsumption.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div>
                  <div className='flex justify-between'>
                    <p className='text-slate-700 font-semibold'>
                      Total amount due
                    </p>
                    = PHP {data.bill.currentBill.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className='mt-7 text-xs'>
              <div className='flex items-center my-4'>
                <span className='border-b border-dashed border-slate-300 flex-grow'></span>
                <span className='mx-4 text-sm text-slate-500'>
                  Payment Info
                </span>
                <span className='border-b border-dashed border-slate-300 flex-grow'></span>
              </div>
              <div>
                <div className='flex justify-between'>
                  <p className='text-slate-700 font-semibold'>Receipt No.</p>
                  <p>{data.receiptNumber}</p>
                </div>
                <div className='flex justify-between'>
                  <p className='text-slate-700 font-semibold'>Payment date</p>
                  <p>{formatDate(data.paymentDate)}</p>
                </div>
                <div className='flex justify-between'>
                  <p className='text-slate-700 font-semibold'>
                    Prev Outstanding balance
                  </p>
                  <p>PHP {data.previousBalance.toFixed(2)}</p>
                </div>
                <div className='flex justify-between'>
                  <p className='text-slate-700 font-semibold'>Payment amount</p>
                  <p>PHP {data.paymentAmount.toFixed(2)}</p>
                </div>
                <div className='text-xs mt-6'>
                  <div className='flex justify-between'>
                    <p className='text-slate-700 font-semibold'>Computation</p>
                    <p>
                      {data.previousBalance.toFixed(2) +
                        ' - ' +
                        data.paymentAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className='flex justify-between'>
                  <p className='text-slate-700 font-semibold'>
                    New Outstanding balance
                  </p>
                  <p> = PHP {data.balance.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {data.note && (
              <div className='mt-6 text-xs'>
                <div className='text-center text-gray-500 text-xs'>Note</div>
                <div className='text-sm flex justify-center'>
                  <p className='w-[17.7rem] text-center'>{data.note}</p>
                </div>
              </div>
            )}

            {/* Receipt Footer */}
            <div className='text-center border-t border-dashed border-gray-400 pt-2 mt-4 text-xs text-gray-500'>
              <p>Transaction ID: {transactionId}</p>
              <p>
                Generated on {new Date().toLocaleDateString()} at{' '}
                {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>

        <div className='flex justify-center mt-5 gap-2'>
          <button className='text-white text-sm px-3 py-2 rounded-lg font-medium flex items-center gap-1 button-red-gradient'>
            <FiArchive size={18} />
            Delete
          </button>
          <button className='text-white text-sm px-3 py-2 rounded-lg font-medium flex items-center gap-1 button-green-gradient'>
            <FiPrinter size={18} />
            Print
          </button>
        </div>
      </div>
    );
  }
};

export default TransactionDetails;
