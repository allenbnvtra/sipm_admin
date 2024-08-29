import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../../utils/axiosInstance';

interface GraphData {
  remainingBalance: number;
  totalPaid: number;
  billingMonth: string;
}

const fetchDataGraph = async (): Promise<GraphData> => {
  const { data } = await axiosInstance.get<{ result: GraphData }>(
    `${import.meta.env.VITE_API_URL}/adminWidgets/getMonthlyBill`
  );
  return data.result;
};

const Graph = () => {
  const { data, isLoading, isError, error } = useQuery<GraphData>({
    queryKey: ['graph'],
    queryFn: fetchDataGraph,
  });

  const chartData = {
    labels: ['Paid', 'Unpaid'],
    datasets: [
      {
        label: data?.billingMonth || '',
        data: [data?.totalPaid || 0, data?.remainingBalance || 0],
        backgroundColor: ['#ADD8E6', '#ffcccb'],
        hoverOffset: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className='relative h-full p-4 text-center flex justify-center items-center text-sm text-slate-700 xxl:h-[21.5rem] xxxl:h-[25rem]'>
          Loading...
        </div>
      );
    }

    if (isError) {
      return (
        <div className='relative h-full p-4 text-center flex justify-center items-center text-sm text-red-600 xxl:h-[21.5rem] xxxl:h-[25rem]'>
          Error: {error.message}
        </div>
      );
    }

    return (
      <div className='relative h-full p-4 xxxl:h-[25rem]'>
        <Doughnut data={chartData} options={chartOptions} />
      </div>
    );
  };

  return (
    <div className='mt-3 flex h-[20rem] max-h-[21.5rem] flex-col justify-center rounded-md border border-slate-200 bg-white p-3 shadow-lg xxl:h-[21.5rem] xxxl:h-[25rem]'>
      <p className='pt-1 text-sm font-medium text-slate-600'>
        Chart for {data?.billingMonth || ''}
      </p>
      {renderContent()}
    </div>
  );
};

export default Graph;
