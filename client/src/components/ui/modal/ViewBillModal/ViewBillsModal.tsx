import { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../../../utils/axiosInstance';

// External Component
import Payment from './Payment';
import MonthlyBill from './MonthlyBill';
import Transactions from './Transactions';

interface ViewBillsModalProps {
  isViewBillsModalOpen: boolean;
  closeViewBillsModal: () => void;
  billId: string | null;
}

interface User {
  _id: string;
  name: string;
  stallNumber: string;
  active: boolean;
}

interface BillResult {
  user: User;
  meterNumber: string;
  currentBill: number;
  currentReading: number;
  previousReading: number;
  totalConsumption: number;
  status: string;
  billingPeriod: Date;
  remainingBalance: number;
  totalPaid: number;
}

const fetchData = async (billId: string): Promise<BillResult> => {
  const { data } = await axiosInstance.get<{ result: BillResult }>(
    `${import.meta.env.VITE_API_URL}/bills/${billId}`
  );

  return data.result;
};

const ViewBillsModal = ({
  isViewBillsModalOpen,
  closeViewBillsModal,
  billId,
}: ViewBillsModalProps) => {
  const { data, isLoading, isError, error } = useQuery<BillResult>({
    queryKey: ['bill', billId],
    queryFn: () => fetchData(billId as string),
    enabled: isViewBillsModalOpen,
  });

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

  useEffect(() => {
    if (isViewBillsModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isViewBillsModalOpen]);

  const handleCloseModal = () => {
    closeViewBillsModal();
    setIsPaymentModalOpen(false);
    setIsTransactionModalOpen(false);
  };

  if (isError) {
    return (
      <div className='text-center text-red-600'>
        Error: {(error as Error).message || 'Failed to load bill details.'}
      </div>
    );
  }

  if (isLoading) {
    return <div className='text-center text-slate-800'>Loading...</div>;
  }

  return (
    <div
      className={`${
        isViewBillsModalOpen ? 'visible' : 'invisible'
      } fixed inset-0 z-[1000] mx-2 flex items-center justify-center`}
    >
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${
          isViewBillsModalOpen ? 'opacity-25' : 'opacity-0'
        }`}
      ></div>
      <div
        className={`z-[1000] mx-2 rounded-md w-full sm:w-[60%] md:w-[50%] lg:w-[30rem] bg-white p-1 transition-transform duration-200 ${
          isViewBillsModalOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className='flex justify-end'>
          <button onClick={handleCloseModal} className='text-lg text-gray-500'>
            <IoClose />
          </button>
        </div>
        <div className='px-5 pb-4'>
          {isPaymentModalOpen && data ? (
            <Payment
              data={data}
              closePaymentModal={() => setIsPaymentModalOpen(false)}
            />
          ) : isTransactionModalOpen && data ? (
            <Transactions
              closeTransactionModal={() => setIsTransactionModalOpen(false)}
            />
          ) : (
            <MonthlyBill
              openTransactionModal={() => setIsTransactionModalOpen(true)}
              data={data}
              openPaymentModal={() => setIsPaymentModalOpen(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewBillsModal;
