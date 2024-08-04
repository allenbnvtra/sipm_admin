import { useEffect, useState } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { GoPeople } from 'react-icons/go';
import { MdMoneyOff, MdOutlineReportOff } from 'react-icons/md';
import SummaryBoxUI from './SummaryBox';
import { IconType } from 'react-icons';

interface SummaryResult {
  userCount: number;
  totalTenantsWithRemainingBalance: number;
  unpaidBills: number;
}

const fetchSummary = async (): Promise<SummaryResult> => {
  const token = localStorage.getItem('token');
  const { data } = await axios.get<{ result: SummaryResult }>(
    `${import.meta.env.VITE_API_URL}/adminWidgets/getWidgetData`,
    {
      headers: {
        Authorization: `Bearer ${token}`, // Add authorization header
      },
    }
  );
  return data.result;
};

const Summary = () => {
  const [showAll, setShowAll] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 500);

  const { data, isLoading, isError } = useQuery<SummaryResult>({
    queryKey: ['summary'],
    queryFn: fetchSummary,
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 500);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderSummaryBox = (title: string, count: number, Icon: IconType) => (
    <SummaryBoxUI
      title={title}
      count={isLoading || isError ? 0 : count}
      icon1={Icon}
    />
  );

  return (
    <div className='grid grid-cols-1 gap-3 xs:grid-cols-3'>
      {renderSummaryBox('Total Tenants', data?.userCount || 0, GoPeople)}
      {(!isMobile || showAll) && (
        <>
          {renderSummaryBox(
            'Unpaid Tenants',
            data?.totalTenantsWithRemainingBalance || 0,
            MdOutlineReportOff
          )}
          {renderSummaryBox('Unpaid Bills', data?.unpaidBills || 0, MdMoneyOff)}
        </>
      )}
      {isMobile && (
        <button
          className='mt-2 text-xs text-slate-700 underline'
          onClick={() => setShowAll((prev) => !prev)}
        >
          {showAll ? 'Show Less' : 'Show More'}
        </button>
      )}
    </div>
  );
};

export default Summary;
