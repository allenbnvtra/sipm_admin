import DashboardTable from '../../components/ui/dashboard/DashboardTable';
import DashboardTransactions from '../../components/ui/dashboard/DashboardTransactions';
import Graph from '../../components/ui/dashboard/Graph';
import Summary from '../../components/ui/dashboard/Summary';
import Title from '../../components/ui/Title';

const Dashboard = () => {
  return (
    <div className='flex flex-col gap-3'>
      <Title title='Dashboard' />

      <div className='grid grid-cols-1 gap-3 lg:grid-cols-7'>
        <div className='lg:col-span-5'>
          <Summary />
          <DashboardTable />
        </div>

        <div className='lg:col-span-2'>
          <DashboardTransactions />
          <Graph />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
