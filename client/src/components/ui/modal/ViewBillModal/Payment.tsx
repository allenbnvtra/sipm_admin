import { useForm } from 'react-hook-form';
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import axiosInstance from '../../../../utils/axiosInstance';
import { MdOutlineAccountBalanceWallet } from 'react-icons/md';
import { formatBillingPeriod, formatCurrency } from '../../../../helpers';
import toast from 'react-hot-toast';

interface PaymentProps {
  billId: string | null;
  data?: {
    billingPeriod?: Date;
    remainingBalance?: number;
    currentBill?: number;
  };
  closePaymentModal: () => void;
  refreshData: () => void;
}

interface FormData {
  paymentDate: string;
  paymentAmount: number;
  receiptNo: string;
  note: string;
}

interface PaymentResponse {
  status: string;
  message: string;
  result: object;
}

const Payment = ({
  billId,
  data,
  closePaymentModal,
  refreshData,
}: PaymentProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  console.log(billId);

  const mutation: UseMutationResult<PaymentResponse, Error, FormData> =
    useMutation({
      mutationFn: async (formData: FormData) => {
        if (!billId) {
          throw new Error('Bill ID is required.');
        }
        const response = await axiosInstance.post<PaymentResponse>(
          `/api/v1/bills/${billId}/payment`,
          formData
        );
        return response.data;
      },
      onSuccess: (data) => {
        toast.success(data.message);
        reset();
        closePaymentModal();
        refreshData();
      },
      onError: (error: Error) => {
        console.error('Payment failed:', error.message);
        toast.error('Payment failed. Please try again.');
      },
    });

  const onSubmit = (formData: FormData) => {
    toast.loading('Processing payment...');
    mutation.mutate(formData, {
      onSuccess: () => {
        toast.dismiss();
      },
      onError: () => {
        toast.dismiss();
      },
    });
  };

  // Determine loading state
  const isLoading = mutation.status === 'pending';

  return (
    <div>
      <div className='flex justify-between items-center m-4'>
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
      <form onSubmit={handleSubmit(onSubmit)} className='text-sm'>
        <div className='flex flex-col'>
          <div className='flex justify-between mb-2 items-center'>
            <p className='text-sm text-center text-slate-800 flex gap-1 items-center'>
              <MdOutlineAccountBalanceWallet size={20} />
              <span className='font-semibold'>
                {data?.remainingBalance !== undefined
                  ? formatCurrency(data.remainingBalance)
                  : 'N/A'}
              </span>
            </p>
            <input
              type='date'
              {...register('paymentDate', { required: true })}
              className='px-2 text-sm border-b border-gray-400 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-transparent'
              placeholder='mm/dd/yyyy'
              disabled={isLoading}
            />
          </div>
          {errors.paymentDate && (
            <p className='text-red-500 text-xs text-end'>
              Payment Date is required
            </p>
          )}
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div>
            <label className='mb-1'>Payment Amount</label>
            <div className='relative'>
              <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500'>
                ₱
              </span>
              <input
                type='number'
                {...register('paymentAmount', { required: true, min: 1 })}
                className='w-full pl-6 pr-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-transparent'
                placeholder='0.00'
                style={{ appearance: 'textfield' }}
                disabled={isLoading}
              />
            </div>
            {errors.paymentAmount && (
              <p className='text-red-500 text-xs mt-2'>
                Payment Amount is required
              </p>
            )}
          </div>
          <div>
            <label className='mb-1'>Receipt No</label>
            <input
              type='text'
              {...register('receiptNo', { required: true })}
              className='w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-transparent'
              placeholder='Receipt Number'
              disabled={isLoading}
            />
            {errors.receiptNo && (
              <p className='text-red-500 text-xs mt-2'>
                Receipt Number is required
              </p>
            )}
          </div>
        </div>
        <div>
          <label className='block mt-2'>Note</label>
          <textarea
            {...register('note')}
            rows={4}
            className='w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-transparent'
            placeholder='Additional notes...'
            disabled={isLoading}
          />
        </div>

        <br />
        <div className='justify-center flex'>
          <button
            type='submit'
            className='bg-green-600 text-white px-8 py-2 rounded-full font-medium button-green-gradient'
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Proceed'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Payment;
