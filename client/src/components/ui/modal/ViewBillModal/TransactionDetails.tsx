import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../../../utils/axiosInstance';
import {
  formatBillingPeriod,
  formatCurrency,
  formatDate,
} from '../../../../helpers';

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
  };
  receiptNumber: string;
  paymentAmount: number;
  note: string;
  balance: number;
  paymentDate: Date;
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

        <div className='bg-white border p-4 rounded shadow-lg max-w-md font-mono md:mx-5'>
          {/* Receipt Header */}
          <div className='text-center border-b border-dashed border-gray-400 pb-2 mb-4'>
            <h2 className='text-xl font-bold'>Transaction Receipt</h2>
            <p className='text-xs text-gray-500'>San Ildefonso Public Market</p>
          </div>

          {/* Tenant Info */}
          <div className='mb-4'>
            <div className='text-center text-gray-500 text-xs mb-2'>
              Billing Info
            </div>
            <div className='text-sm'>
              <div className='flex justify-between'>
                <p>Name</p>
                <p>{data.user.name}</p>
              </div>
              <div className='flex justify-between'>
                <p>Username</p>
                <p>{data.user.email}</p>
              </div>
              <div className='flex justify-between'>
                <p>Stall Number</p>
                <p>{data.user.stallNumber}</p>
              </div>
            </div>
            <div className='text-sm'>
              <div className='flex justify-between'>
                <p>Billing Period</p>
                {formatBillingPeriod(data.bill.billingPeriod)}
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className='mb-4'>
            <div className='text-center text-gray-500 text-xs mb-2'>
              Payment Info
            </div>
            <div className='text-sm'>
              <div className='flex justify-between'>
                <p>Receipt No.</p>
                <p>{data.receiptNumber}</p>
              </div>
              <div className='flex justify-between'>
                <p>Payment Date</p>
                <p>{formatDate(data.paymentDate)}</p>
              </div>
              <div className='flex justify-between'>
                <p>Payment Amount</p>
                <p>{formatCurrency(data.paymentAmount)}</p>
              </div>
              <div className='flex justify-between'>
                <p>Balance after payment</p>
                <p>{formatCurrency(data.balance)}</p>
              </div>
            </div>
          </div>

          {/* Receipt Footer */}
          <div className='text-center border-t border-dashed border-gray-400 pt-2 mt-4 text-xs text-gray-500'>
            <p>Transaction ID: {transactionId}</p>
            <p>Generated on {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    );
  }
};

export default TransactionDetails;
