import { useQuery } from '@tanstack/react-query';
import { FaClock } from 'react-icons/fa';
import { MdOutlineEventNote } from 'react-icons/md';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../../utils/axiosInstance';
import { useState } from 'react';
import ViewBillsModal from '../modal/ViewBillModal/ViewBillsModal';
import { formatBillingPeriod, formatCurrency } from '../../../helpers';
import { IoIosAddCircleOutline } from 'react-icons/io';

interface MonthlyBillPerTenant {
  id: string;
  billingPeriod: Date;
  status: string;
  amountPaid: number;
  meterNumber: string;
  remainingBalance: number;
}

interface MonthlyBillPerTenantResponse {
  status: string;
  result: MonthlyBillPerTenant[];
  totalBills: number;
}

interface MonthlyBillProps {
  year: string;
}

const fetchMonthlyBillPerTenant = async (
  year: string,
  tenantId: string
): Promise<MonthlyBillPerTenantResponse> => {
  const { data } = await axiosInstance.get<MonthlyBillPerTenantResponse>(
    `${import.meta.env.VITE_API_URL}/tenants/${tenantId}/bill`,
    {
      params: {
        year,
      },
    }
  );

  data.result = data.result.map((bill) => ({
    ...bill,
    billingPeriod: new Date(bill.billingPeriod), // Convert to Date
  }));

  return data;
};

const MonthlyBill = ({ year }: MonthlyBillProps) => {
  const { tenantId } = useParams<{ tenantId: string }>();
  const [isViewBillModalOpen, setIsViewBillModalOpen] =
    useState<boolean>(false);
  const [billId, setBillId] = useState<string | null>(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['tenantMonthlyBill', year, tenantId],
    queryFn: () => fetchMonthlyBillPerTenant(year, tenantId as string),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  const handleOpenBillModal =
    (billId: string) =>
    (event: React.MouseEvent<HTMLDivElement>): void => {
      event.preventDefault();
      setIsViewBillModalOpen(true);
      setBillId(billId);
    };

  if (isLoading) {
    return (
      <div className='p-5'>
        <p className='text-center text-slate-800 text-xs'>Loading...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='p-5'>
        <p className='text-center text-red-600'>Error: {error.message}</p>
      </div>
    );
  }

  if (!data || !data.result || data.result.length === 0) {
    return (
      <div className='p-5'>
        <p className='text-center text-slate-800 text-sm'>
          No monthly bill found.
        </p>
      </div>
    );
  }

  return (
    <>
      {data.result.map((bill) => (
        <div key={bill.id}>
          <div
            onClick={handleOpenBillModal(bill.id)}
            className='cursor-pointer hover:bg-slate-50 transition-all border-b'
          >
            <div className='flex justify-between items-center p-3 bg-slate-200 text-xs'>
              <p className='font-semibold text-md text-indigo-900 flex items-center gap-1'>
                <MdOutlineEventNote className='text-lg' />
                {formatBillingPeriod(new Date(bill.billingPeriod))}
              </p>
              <p className='text-green-600'>Details &gt;</p>
            </div>

            <div className='px-5 py-7 grid md:grid-cols-4 gap-4 grid-cols-2'>
              <div className='text-xs flex flex-col items-center'>
                <p className='mb-1 text-md font-semibold text-slate-600'>
                  Status
                </p>
                <p
                  className={`${
                    bill.status.toLowerCase() === 'paid'
                      ? 'bg-green-200 text-green-600'
                      : 'bg-red-200 text-red-900'
                  } font-medium text-center py-2 rounded-full flex justify-center items-center px-4 gap-1`}
                >
                  <FaClock /> {bill.status === 'paid' ? 'Paid' : 'Unpaid'}
                </p>
              </div>
              <div className='text-xs flex flex-col items-center'>
                <p className='mb-1 text-md font-semibold text-slate-600'>
                  Meter Number
                </p>
                <p className='py-[2px] text-slate-800'>
                  {bill.meterNumber ? bill.meterNumber : 'N/A'}
                </p>
              </div>
              <div className='text-xs flex flex-col items-center'>
                <p className='mb-1 text-md font-semibold text-slate-600'>
                  Amount Paid
                </p>
                <p className='py-[2px] text-slate-800'>
                  {formatCurrency(bill.amountPaid)}
                </p>
              </div>
              <div className='text-xs flex flex-col items-center'>
                <p className='mb-1 text-md font-semibold text-slate-600'>
                  Remaining Balance
                </p>
                <p className='py-[2px] text-slate-800'>
                  {formatCurrency(bill.remainingBalance)}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className='cursor-pointer hover:bg-slate-50 transition-all border-b'>
        <div className='flex justify-between items-center p-3 bg-slate-200 text-xs'>
          <p className='font-semibold text-md text-indigo-900 flex items-center gap-1'>
            <MdOutlineEventNote className='text-lg' />
            {formatBillingPeriod(new Date())}
          </p>
        </div>

        <div className='px-5 py-7 flex justify-center items-center gap-2 text-indigo-800'>
          <IoIosAddCircleOutline size={30} /> Add new bill
        </div>
      </div>

      <ViewBillsModal
        billId={billId}
        isViewBillsModalOpen={isViewBillModalOpen}
        closeViewBillsModal={() => setIsViewBillModalOpen(false)}
      />
    </>
  );
};

export default MonthlyBill;
