import {
  FaAngleLeft,
  FaAngleRight,
  FaRegEdit,
  FaRegListAlt,
} from 'react-icons/fa';
import { FiArchive } from 'react-icons/fi';
import { IoHomeSharp, IoSearchSharp } from 'react-icons/io5';
import { MdFilterList } from 'react-icons/md';
import { IoMdPersonAdd } from 'react-icons/io';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

import DeleteModal from '../../components/ui/modal/DeleteModal';
import EditModal from '../../components/ui/modal/EditModal';
import AddTenantModal from '../../components/ui/modal/AddTenantModal';
import Filter from '../../components/ui/tenants/Filter';
import axiosInstance from '../../utils/axiosInstance';

interface TenantsData {
  id: string;
  name: string;
  stallNumber: string;
  username: string;
  remainingBalance: number;
}

interface TenantsResponse {
  result: TenantsData[];
  page: number;
  totalPages: number;
  totalUsersCount: number;
}

const fetchTenants = async (
  page: number,
  searchTenant: string,
  query: string
): Promise<TenantsResponse> => {
  const { data } = await axiosInstance.get<TenantsResponse>(
    `${import.meta.env.VITE_API_URL}/tenants`,
    {
      params: {
        search: searchTenant,
        page,
        sort: query,
      },
    }
  );
  return data;
};

const TenantsPage = () => {
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);

  const [isEditTenantModalOpen, setIsEditTenantModalOpen] =
    useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [isAddTenantModalOpen, setIsAddTenantModalOpen] =
    useState<boolean>(false);

  const [query, setQuery] = useState<string>('');

  const handleFilterChange = (filter: string) => {
    setQuery(filter);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['tenants', page, search, query],
    queryFn: () => fetchTenants(page, search, query),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  const tenantsData = data?.result || [];
  const totalPages = data?.totalPages || 1;
  const totalUsersCount = data?.totalUsersCount || 0;

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className='sm:px-[6rem] md:px-0 lg:px-[2rem] xl:px-[6rem]'>
      <p className='text-xs text-slate-700 flex gap-2'>
        <Link to='/dashboard'>
          <IoHomeSharp size={15} />
        </Link>
        / <span className='text-green-600'>Tenants</span>
      </p>

      <div className='mt-3'>
        <div className='flex items-center justify-between'>
          <div className='relative'>
            <input
              type='search'
              placeholder='Search...'
              className='rounded-full border border-slate-400 bg-white py-2 pl-9 pr-3 text-xs focus:outline-none sm:w-[18rem]'
              value={search}
              onChange={handleSearchChange}
            />
            <IoSearchSharp className='absolute left-4 top-[10px] text-slate-500' />
          </div>

          <div className='flex items-center gap-2'>
            <IoMdPersonAdd
              title='Add New Tenant'
              className='cursor-pointer text-2xl text-slate-700'
              onClick={() => setIsAddTenantModalOpen(true)}
            />

            <div className='relative'>
              <MdFilterList
                title='Filter'
                className='cursor-pointer text-2xl text-slate-700'
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              />
              {isFilterOpen && <Filter onFilterChange={handleFilterChange} />}
            </div>
          </div>
        </div>

        <AddTenantModal
          isAddTenantModalOpen={isAddTenantModalOpen}
          closeAddTenantModal={() => setIsAddTenantModalOpen(false)}
        />
      </div>

      <div className='relative z-0 mt-4 h-[44rem] overflow-x-auto rounded-md border border-slate-300 bg-white shadow-md md:h-[80vh]'>
        <div className='h-[calc(100%-3rem)] overflow-y-auto scrollbar-hide rounded-t-md'>
          {isLoading ? (
            <div className='flex w-full justify-center items-center h-full'>
              <p className='flex justify-center absolute top-[250px] left-[500px] text-slate-800 text-xs'>
                Loading...
              </p>
            </div>
          ) : isError ? (
            <div className='flex justify-center items-center h-full text-slate-800 text-xs'>
              <p>Error loading data: {error.message}</p>
            </div>
          ) : (
            <table className='w-full rounded-t-xl'>
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
                        &#8369; {tenant.remainingBalance.toLocaleString()}
                      </td>
                      <td className='flex items-center justify-center gap-2 py-3 text-lg md:text-[16px]'>
                        <Link to={`/tenants/${tenant.id}`}>
                          <FaRegListAlt
                            title='View Bills'
                            className='cursor-pointer text-blue-700'
                          />
                        </Link>
                        <FaRegEdit
                          title='Edit'
                          className='cursor-pointer text-green-600'
                          onClick={() => setIsEditTenantModalOpen(true)}
                        />
                        <FiArchive
                          title='Archive'
                          className='cursor-pointer text-red-600'
                          onClick={() => setIsDeleteModalOpen(true)}
                        />
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
          )}
        </div>
        <div className='absolute bottom-0 left-0 w-full rounded-b-md bg-slate-700 text-white'>
          <div className='flex w-full items-center gap-3 border-t px-5 py-4 text-xs'>
            <p>
              {isLoading
                ? 'Loading...'
                : `${(page - 1) * 10 + 1}-${Math.min(
                    page * 10,
                    totalUsersCount
                  )} of${' '}
              ${totalUsersCount}`}
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

      <EditModal
        isEditTenantModalOpen={isEditTenantModalOpen}
        closeEditTenantModal={() => setIsEditTenantModalOpen(false)}
      />
      <DeleteModal
        isDeleteModalOpen={isDeleteModalOpen}
        closeDeleteModal={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};

export default TenantsPage;
