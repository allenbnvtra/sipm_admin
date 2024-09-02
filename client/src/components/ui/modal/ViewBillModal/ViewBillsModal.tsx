import { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../../../utils/axiosInstance';

import Payment from './Payment';
import MonthlyBill from './MonthlyBill';
import Transactions from './Transactions';
import DeleteBillModal from './DeleteBillModal';

interface ViewBillsModalProps {
  refreshData: () => void;
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
  refreshData,
  isViewBillsModalOpen,
  closeViewBillsModal,
  billId,
}: ViewBillsModalProps) => {
  const { data, isLoading, isError, error, refetch } = useQuery<BillResult>({
    queryKey: ['bill', billId],
    queryFn: () => fetchData(billId as string),
    enabled: isViewBillsModalOpen,
  });

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] =
    useState<boolean>(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState<boolean>(false);

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
    setIsArchiveModalOpen(false);
  };

  const handleRefreshData = () => {
    refetch();
    refreshData();
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
              refreshData={handleRefreshData}
              billId={billId}
              data={data}
              closePaymentModal={() => {
                setIsPaymentModalOpen(false);
                handleRefreshData();
              }}
            />
          ) : isTransactionModalOpen && data && billId ? (
            <Transactions
              billId={billId}
              closeTransactionModal={() => {
                setIsTransactionModalOpen(false);
                handleRefreshData();
              }}
            />
          ) : isArchiveModalOpen && billId && data ? (
            <DeleteBillModal
              billSuccess={() => closeViewBillsModal()}
              refreshData={() => handleRefreshData()}
              billId={billId}
              data={data}
              closeDeleteBillModal={() => setIsArchiveModalOpen(false)}
            />
          ) : (
            <MonthlyBill
              data={data}
              openArchiveModal={() => setIsArchiveModalOpen(true)}
              openTransactionModal={() => setIsTransactionModalOpen(true)}
              openPaymentModal={() => setIsPaymentModalOpen(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewBillsModal;
