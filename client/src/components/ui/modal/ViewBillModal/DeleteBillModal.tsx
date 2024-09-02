import { FaArchive } from 'react-icons/fa';
import { IoWarning } from 'react-icons/io5';
import { formatBillingPeriod } from '../../../../helpers';
import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../../../../utils/axiosInstance';
import toast from 'react-hot-toast';

interface DeleteBillModalProps {
  refreshData: () => void;
  billSuccess: () => void;
  closeDeleteBillModal: () => void;
  billId: string;
  data: {
    user: {
      name: string;
    };
    billingPeriod: Date;
  };
}

const DeleteBillModal = ({
  refreshData,
  billSuccess,
  closeDeleteBillModal,
  data,
  billId,
}: DeleteBillModalProps) => {
  const deleteBillMutation = useMutation({
    mutationFn: async () => {
      await axiosInstance.delete(`/api/v1/bills/${billId}`);
    },
    onSuccess: () => {
      toast.success('Bill deleted successfully!');
      billSuccess();
      refreshData();
    },
    onError: () => {
      toast.error('Failed delete the bill. Please try again.');
    },
  });

  const handleDelete = () => {
    deleteBillMutation.mutate();
  };

  const isLoading = deleteBillMutation.status === 'pending';

  return (
    <div>
      <p className='mb-3 text-center font-semibold text-slate-800'>
        Delete bill?
      </p>
      <p className='mb-3 text-center text-xs text-slate-600'>
        Are you sure you want to delete this bill?
      </p>

      <div className='p-2'>
        <div className='rounded-md bg-red-100 px-7 py-2 text-red-700'>
          <p className='flex items-center gap-1'>
            <IoWarning /> Warning
          </p>

          <p className='mt-2 text-xs'>
            <span className='font-extrabold text-red-800'>
              {data.user.name}'s
            </span>{' '}
            bill and transactions for the month of{' '}
            <span className='font-extrabold text-red-800'>
              {formatBillingPeriod(data.billingPeriod)}
            </span>{' '}
            will be deleted permanently from the database.
          </p>
        </div>
      </div>

      <div className='flex justify-center gap-4 py-4 text-xs'>
        <button
          className='rounded-md border border-slate-300 px-4 py-2 text-slate-800'
          onClick={closeDeleteBillModal}
        >
          Cancel
        </button>
        <button
          className='flex items-center gap-1 rounded-md bg-red-500 px-4 py-2 text-white'
          onClick={handleDelete} // Trigger the delete function on click
          disabled={isLoading} // Disable the button while deleting
        >
          <FaArchive /> {isLoading ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
};

export default DeleteBillModal;
