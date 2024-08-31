import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import axiosInstance from '../../../utils/axiosInstance';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';

interface AddBillModalProps {
  userId: string | undefined;
  meterNumber: string;
  previousReading: number;
  isAddBillModalOpen: boolean;
  nextBillingPeriod: Date;
  closeAddBillModal: () => void;
  refreshData: () => void;
}

interface FormData {
  meterNumber: string;
  currentReading: number;
  previousReading: number;
  amountPerConsumption: number;
  billingPeriod: string;
}

interface NewBillResponse {
  status: string;
  message: string;
  result: object;
}

const AddBillModal = ({
  userId,
  meterNumber,
  previousReading,
  isAddBillModalOpen,
  closeAddBillModal,
  refreshData,
  nextBillingPeriod,
}: AddBillModalProps) => {
  const [totalConsumption, setTotalConsumption] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  useEffect(() => {
    if (isAddBillModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isAddBillModalOpen]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<FormData>({
    defaultValues: {
      meterNumber: meterNumber,
      previousReading: previousReading,
      billingPeriod: nextBillingPeriod.toISOString().split('T')[0],
    },
  });

  const currentReading = watch('currentReading');
  const amountPerConsumption = watch('amountPerConsumption');

  useEffect(() => {
    if (currentReading && previousReading && amountPerConsumption) {
      setTotalConsumption(currentReading - previousReading);
      setTotalAmount(totalConsumption * amountPerConsumption);
    }
  }, [currentReading, previousReading, amountPerConsumption, totalConsumption]);

  const mutation: UseMutationResult<NewBillResponse, Error, FormData> =
    useMutation({
      mutationFn: async (formData: FormData) => {
        if (!userId) {
          throw new Error('User ID is required.');
        }
        const response = await axiosInstance.post<NewBillResponse>(
          `/api/v1/bills/${userId}/newBill`,
          formData
        );
        return response.data;
      },
      onSuccess: () => {
        reset();
        closeAddBillModal();
        refreshData();
      },
      onError: (error: Error) => {
        console.error('Action failed:', error.message);
      },
    });

  const onSubmit = (formData: FormData) => {
    const loadingId = toast.loading('Processing new bill...');
    mutation.mutate(formData, {
      onSuccess: () => {
        toast.success('Bill successfully added!', { id: loadingId });
      },
      onError: () => {
        toast.error('Action failed. Please try again.', { id: loadingId });
      },
    });
  };

  const isLoading = mutation.status === 'pending';

  return (
    <div
      className={`${
        isAddBillModalOpen ? 'visible' : 'invisible'
      } fixed inset-0 z-[1000] mx-2 flex items-center justify-center`}
    >
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${
          isAddBillModalOpen ? 'opacity-50' : 'opacity-0'
        }`}
      ></div>
      <div
        className={`z-[1000] mx-2 rounded-md bg-white p-1 transition-transform duration-200 ${
          isAddBillModalOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className='flex justify-end'>
          <button
            onClick={() => {
              closeAddBillModal();
              reset();
            }}
            className='text-lg text-gray-500'
          >
            <IoClose />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='px-4 text-sm'>
          <div className='mb-4'>
            <label htmlFor='meterNumber' className='text-center'>
              Meter Number
            </label>
            <br />
            <input
              className='w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-transparent'
              type='text'
              {...register('meterNumber', { required: true })}
              placeholder='Enter meter number'
              defaultValue={meterNumber}
              disabled={isLoading}
            />
            {errors.meterNumber && (
              <p className='text-red-500'>Meter number is required.</p>
            )}
          </div>

          <div className='flex gap-2'>
            <div className=''>
              <label htmlFor='previousReading'>Previous Reading</label>
              <br />
              <input
                className='w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-transparent'
                type='number'
                {...register('previousReading', { required: true })}
                style={{ appearance: 'textfield' }}
                placeholder='Enter previous reading'
                defaultValue={previousReading}
                disabled={isLoading}
              />
              {errors.previousReading && (
                <p className='text-red-500'>Previous reading is required.</p>
              )}
            </div>
            <div className=''>
              <label htmlFor='currentReading'>Current Reading</label>
              <br />
              <input
                className='w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-transparent'
                type='number'
                {...register('currentReading', { required: true })}
                style={{ appearance: 'textfield' }}
                placeholder='Enter current reading'
                disabled={isLoading}
              />
              {errors.currentReading && (
                <p className='text-red-500'>Current reading is required.</p>
              )}
            </div>
          </div>

          <div className='flex gap-2 mt-4'>
            <div className=' w-1/2'>
              <label htmlFor='billingPeriod'>Billing Period</label>
              <br />
              <input
                className='w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-transparent'
                type='date'
                {...register('billingPeriod', { required: true })}
                placeholder='mm/dd/yyyy'
                disabled={isLoading}
              />
              {errors.billingPeriod && (
                <p className='text-red-500'>Billing period is required.</p>
              )}
            </div>
            <div className=' w-1/2'>
              <label htmlFor='amountPerConsumption'>
                Amount Per Consumption
              </label>
              <br />
              <div className='relative'>
                <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500'>
                  ₱
                </span>
                <input
                  className='w-full pl-6 pr-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-transparent'
                  type='number'
                  {...register('amountPerConsumption', { required: true })}
                  style={{ appearance: 'textfield' }}
                  placeholder='0.00'
                  disabled={isLoading}
                />
              </div>
              {errors.amountPerConsumption && (
                <p className='text-red-500'>
                  Amount per consumption is required.
                </p>
              )}
            </div>
          </div>

          <div className='mt-5 text-sm text-slate-700'>
            <p>
              Total Consumption :{' '}
              <span className='font-semibold text-slate-900'>
                {totalConsumption} kWh
              </span>
            </p>
            <p>
              Amount :{' '}
              <span className='font-semibold text-slate-900'>
                PHP {totalAmount.toFixed(2)}
              </span>
            </p>
          </div>

          <div className='flex justify-center mt-5 mb-3'>
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
    </div>
  );
};

export default AddBillModal;
