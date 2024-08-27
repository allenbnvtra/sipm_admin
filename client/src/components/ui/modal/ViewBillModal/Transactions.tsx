import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../../../utils/axiosInstance';
import { formatBillingPeriod, formatCurrency } from '../../../../helpers';

interface TransactionsProps {
  billId: string;
  closeTransactionModal: () => void;
}

interface TransactionsResult {
  transactionId: string;
  billingDate: Date;
  receiptNo: string;
  paymentAmount: number;
  paymentDate: Date;
}

const fetchTransactions = async (
  billId: string
): Promise<TransactionsResult[]> => {
  const { data } = await axiosInstance.get<{ result: TransactionsResult[] }>(
    `${import.meta.env.VITE_API_URL}/bills/${billId}/transactions`
  );

  return data.result;
};

const Transactions = ({ closeTransactionModal, billId }: TransactionsProps) => {
  const { data, isLoading, isError, error } = useQuery<TransactionsResult[]>({
    queryKey: ['transactions', billId],
    queryFn: () => fetchTransactions(billId),
  });

  return (
    <div className='max-h-[23.7rem] h-[23.7rem]'>
      <div className='flex justify-between items-center mb-4'>
        <button
          onClick={closeTransactionModal}
          className='text-sm text-slate-500'
        >
          ← Back
        </button>
        <h2 className='text-lg font-semibold'>Transactions</h2>
      </div>

      <div className='max-h-[22rem] overflow-hidden overflow-y-auto'>
        {isLoading ? (
          <p className='text-sm text-slate-800 flex justify-center h-full items-center'>
            Loading please wait...
          </p>
        ) : isError ? (
          <p className='text-sm text-slate-800 flex justify-center h-full items-center'>
            Error:{' '}
            {error instanceof Error ? error.message : 'Unknown error occurred.'}
          </p>
        ) : data && data.length > 0 ? (
          data.map((transaction) => (
            <div
              key={transaction.transactionId}
              className='flex justify-between text-sm text-slate-700 border p-4 rounded-md border-slate-300 mb-3'
            >
              <div className='pr-2'>
                <p className='whitespace-nowrap w-[11rem] sm:w-auto max-w-[13rem] text-ellipsis overflow-hidden'>
                  Payment for{' '}
                  <span className='font-semibold text-slate-800'>
                    {formatBillingPeriod(transaction.billingDate)}
                  </span>
                  's bill
                </p>
                <p>
                  {transaction.receiptNo} -{' '}
                  {new Date(transaction.paymentDate).toLocaleDateString(
                    'en-US',
                    {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                    }
                  )}
                </p>
              </div>
              <div>
                <p className='text-blue-700 font-semibold'>
                  {formatCurrency(transaction.paymentAmount)}
                </p>
                <p className='text-end text-green-400 underline cursor-pointer'>
                  Details
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className='text-slate-800 h-[90%] w-full flex justify-center items-center'>
            <p className='text-sm text-slate-800 flex justify-center h-full items-center'>
              No transactions found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
