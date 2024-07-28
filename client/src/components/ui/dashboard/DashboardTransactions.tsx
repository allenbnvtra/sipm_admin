import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Transaction {
  username: string;
  receiptNo: string;
  paymentAmount: number;
}

const fetchTransactions = async (): Promise<Transaction[]> => {
  const { data } = await axios.get<{ result: Transaction[] }>(
    `${import.meta.env.VITE_API_URL}/adminWidgets/getRecentTransaction`
  );
  return data.result;
};

const DashboardTransactions = () => {
  const {
    data: transactions,
    isLoading,
    isError,
    error,
  } = useQuery<Transaction[], Error>({
    queryFn: fetchTransactions,
    queryKey: ['transactions'],
  });

  if (isLoading) {
    return (
      <div className='w-full rounded-md border border-slate-200 bg-white p-3 shadow-md'>
        <div className='flex justify-between'>
          <p className='pt-1 text-sm font-medium text-slate-600'>
            Recent Transaction
          </p>
          <p className='cursor-pointer text-xs text-slate-600 underline'>
            See all
          </p>
        </div>
        <div className='overflow-x-auto scrollbar-hide'>
          <table className='mt-4 w-full'>
            <thead className='bg-slate-700 text-xs text-white'>
              <tr>
                <th className='p-2 text-center font-normal w-[33%]'>
                  Username
                </th>
                <th className='p-2 text-center font-normal w-[34%]'>
                  Receipt No.
                </th>
                <th className='p-2 text-center font-normal w-[33%]'>
                  Payment Amount
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className='h-[11.2rem]'>
                <td
                  colSpan={3}
                  className='p-2 text-sm text-center text-slate-600 h-full'
                >
                  Loading...
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='w-full rounded-md border border-slate-200 bg-white p-3 shadow-md'>
        <div className='flex justify-between'>
          <p className='pt-1 text-sm font-medium text-slate-700'>
            Recent Transaction
          </p>
          <p className='cursor-pointer text-xs text-slate-600 underline'>
            See all
          </p>
        </div>
        <div className='p-2 text-sm text-center text-red-600 flex justify-center items-center h-[14.2rem]'>
          Error loading transactions: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className='w-full rounded-md border border-slate-200 bg-white p-3 shadow-md'>
      <div className='flex justify-between'>
        <p className='pt-1 text-sm font-medium text-slate-600'>
          Recent Transaction
        </p>
        <p className='cursor-pointer text-xs text-slate-600 underline'>
          See all
        </p>
      </div>

      <div className='overflow-x-auto scrollbar-hide'>
        <table className='mt-4 w-full'>
          <thead className='bg-slate-700 text-xs text-white'>
            <tr>
              <th className='px-2 py-4 text-center font-normal w-[33%]'>
                Username
              </th>
              <th className='px-2 py-4 text-center font-normal w-[34%]'>
                Receipt No.
              </th>
              <th className='px-2 py-4 text-center font-normal w-[33%] whitespace-nowrap'>
                Payment Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions?.length ? (
              transactions.map((transaction, index) => (
                <tr
                  key={index}
                  className='border-b h-10 max-h-10 text-xs text-center text-slate-800'
                >
                  <td
                    title={transaction.username}
                    className='p-2 text-center font-normal text-ellipsis max-w-20 overflow-hidden whitespace-nowrap'
                  >
                    {transaction.username}
                  </td>
                  <td
                    title={transaction.receiptNo}
                    className='p-2 text-center font-normal text-ellipsis max-w-20 overflow-hidden whitespace-nowrap'
                  >
                    {transaction.receiptNo}
                  </td>
                  <td className='p-2 text-center font-normal text-ellipsis max-w-20 overflow-hidden whitespace-nowrap'>
                    &#8369; {transaction.paymentAmount.toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr className='h-[11.2rem]'>
                <td
                  colSpan={3}
                  className='text-sm p-2 text-center text-slate-600'
                >
                  No transactions available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardTransactions;
