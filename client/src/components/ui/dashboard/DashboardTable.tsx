import { IoSearchSharp } from 'react-icons/io5';
import { FaAngleLeft, FaAngleRight, FaRegListAlt } from 'react-icons/fa';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import ViewBillsModal from '../modal/ViewBillsModal';
import { Link } from 'react-router-dom';

interface TenantsData {
  id: string;
  name: string;
  stallNumber: string;
  username: string;
  balance: number;
}

interface TenantsResponse {
  result: TenantsData[];
  page: number;
  totalPages: number;
  totalUsersCount: number;
}

const fetchTenants = async (
  page: number,
  searchTenant: string
): Promise<TenantsResponse> => {
  const token = localStorage.getItem('token');
  const { data } = await axios.get<TenantsResponse>(
    `${import.meta.env.VITE_API_URL}/adminWidgets/getTenantData`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        search: searchTenant,
        page,
      },
    }
  );
  return data;
};

const DashboardTable = () => {
  const [searchTenant, setSearchTenant] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['tenants', page, searchTenant],
    queryFn: () => fetchTenants(page, searchTenant),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  const tenantsData = data?.result || [];
  const totalPages = data?.totalPages || 1;
  const totalUsersCount = data?.totalUsersCount || 0;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTenant(e.target.value);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  if (isLoading)
    return (
      <div className='mt-3 rounded-md border border-slate-200 bg-white p-3 shadow-md'>
        <div className='flex items-center justify-between'>
          <p className='pt-1 text-sm font-medium text-slate-600'>Tenants</p>
          <div className='relative'>
            <input
              type='search'
              placeholder='Search...'
              value={searchTenant}
              onChange={handleSearchChange}
              className='rounded-full border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs focus:outline-none sm:w-[18rem]'
            />
            <IoSearchSharp className='absolute left-4 top-[10px] text-slate-500' />
          </div>
        </div>

        <div className='relative z-0 mt-4 h-[26.1rem] overflow-hidden rounded-lg border border-slate-300 bg-white shadow-md'>
          <div className='h-[calc(100%-3rem)] overflow-y-auto scrollbar-hide'>
            <table className='w-full'>
              <thead className='sticky top-0 text-sm'>
                <tr>
                  <th className='t_head w-[15%]'>ID</th>
                  <th className='t_head w-[20%]'>Name</th>
                  <th className='t_head w-[15%] whitespace-nowrap'>
                    Stall No.
                  </th>
                  <th className='t_head w-[20%]'>Username</th>
                  <th className='t_head w-[15%]'>Balance</th>
                  <th className='t_head w-[10%]'>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className='h-[17rem]'>
                  <td
                    colSpan={6}
                    className='text-center text-sm h-full text-slate-700'
                  >
                    Loading...
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className='absolute bottom-0 left-0 w-full rounded-b-md bg-slate-600 text-white'>
            <div className='flex w-full items-center gap-3 border-t px-5 py-4 text-xs'>
              <p>Loading...</p>
              <div className='flex gap-3 text-sm'>
                <p className='cursor-pointer'>
                  <FaAngleLeft />
                </p>
                <p className='cursor-pointer'>
                  <FaAngleRight />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  if (isError)
    return (
      <div className='mt-3 rounded-md border border-slate-200 bg-white p-3 shadow-md'>
        <div className='flex items-center justify-between'>
          <p className='pt-1 text-sm font-medium text-slate-600'>Tenants</p>
          <div className='relative'>
            <input
              type='search'
              placeholder='Search...'
              value={searchTenant}
              onChange={handleSearchChange}
              className='rounded-full border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs focus:outline-none sm:w-[18rem]'
            />
            <IoSearchSharp className='absolute left-4 top-[10px] text-slate-500' />
          </div>
        </div>

        <div className='relative z-0 mt-4 h-[26.1rem] overflow-hidden rounded-md border border-slate-300 bg-white shadow-md'>
          <div className='h-[calc(100%-3rem)] overflow-y-auto scrollbar-hide'>
            <table className='w-full'>
              <thead className='sticky top-0 text-sm'>
                <tr>
                  <th className='t_head w-[15%]'>ID</th>
                  <th className='t_head w-[20%]'>Name</th>
                  <th className='t_head w-[15%] whitespace-nowrap'>
                    Stall No.
                  </th>
                  <th className='t_head w-[20%]'>Username</th>
                  <th className='t_head w-[15%]'>Balance</th>
                  <th className='t_head w-[10%]'>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className='h-[17rem]'>
                  <td
                    colSpan={6}
                    className='text-center text-sm h-full text-red-600'
                  >
                    Error: {error.message}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className='absolute bottom-0 left-0 w-full rounded-b-md bg-slate-600 text-white'>
            <div className='flex w-full items-center gap-3 border-t px-5 py-4 text-xs'>
              <p>{error.message}</p>
              <div className='flex gap-3 text-sm'>
                <p className='cursor-pointer'>
                  <FaAngleLeft />
                </p>
                <p className='cursor-pointer'>
                  <FaAngleRight />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <>
      <div className='mt-3 rounded-md border border-slate-200 bg-white p-3 shadow-md'>
        <div className='flex items-center justify-between'>
          <p className='pt-1 text-sm font-medium text-slate-600'>Tenants</p>
          <div className='relative'>
            <input
              type='search'
              placeholder='Search...'
              value={searchTenant}
              onChange={handleSearchChange}
              className='rounded-full border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs focus:outline-none sm:w-[18rem]'
            />
            <IoSearchSharp className='absolute left-4 top-[9px] text-slate-500' />
          </div>
        </div>

        <div className='relative z-0 mt-4 h-[26.1rem] overflow-hidden rounded-md border border-slate-300 bg-white shadow-md'>
          <div className='h-[calc(100%-3rem)] overflow-y-auto scrollbar-hide'>
            <table className='w-full'>
              <thead className='sticky top-0 text-sm'>
                <tr>
                  <th className='t_head w-[15%]'>ID</th>
                  <th className='t_head w-[20%]'>Name</th>
                  <th className='t_head w-[15%] whitespace-nowrap'>
                    Stall No.
                  </th>
                  <th className='t_head w-[20%]'>Username</th>
                  <th className='t_head w-[15%]'>Balance</th>
                  <th className='t_head w-[10%]'>Action</th>
                </tr>
              </thead>
              <tbody>
                {tenantsData.length > 0 ? (
                  tenantsData.map((tenant, index) => (
                    <tr key={index} className='border-b border-b-slate-300'>
                      <td title={tenant.id} className='t_column'>
                        {tenant.id}
                      </td>
                      <td title={tenant.name} className='t_column'>
                        {tenant.name}
                      </td>
                      <td className='t_column'>{tenant.stallNumber}</td>
                      <td className='t_column'>{tenant.username}</td>
                      <td className='t_column'>
                        &#8369; {tenant.balance.toLocaleString()}
                      </td>
                      <td className='flex items-center justify-center gap-2 py-3 text-lg md:text-[16px]'>
                        <Link to={`/tenants/${tenant.id}`}>
                          <FaRegListAlt
                            onClick={() => setIsModalOpen(true)}
                            title='View Bills'
                            className='cursor-pointer text-blue-700'
                          />
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className='border-b border-b-slate-300'>
                    <td
                      colSpan={6}
                      className='text-sm p-2 text-center text-slate-600'
                    >
                      No user found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className='absolute bottom-0 left-0 w-full rounded-b-md bg-slate-700 text-white'>
            <div className='flex w-full items-center gap-3 border-t px-5 py-4 text-xs'>
              <p>
                {(page - 1) * 10 + 1}-{Math.min(page * 10, totalUsersCount)} of{' '}
                {totalUsersCount}
              </p>
              <div className='flex gap-3 text-sm'>
                <p
                  className='cursor-pointer'
                  onClick={() => handlePageChange(page - 1)}
                >
                  <FaAngleLeft />
                </p>
                <p
                  className='cursor-pointer'
                  onClick={() => handlePageChange(page + 1)}
                >
                  <FaAngleRight />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ViewBillsModal
        isViewBillsModalOpen={isModalOpen}
        closeViewBillsModal={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default DashboardTable;
