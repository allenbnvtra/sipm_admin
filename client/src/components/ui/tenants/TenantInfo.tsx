import DeleteModal from '../modal/DeleteModal';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { AiOutlineMessage } from 'react-icons/ai';
import { IoPersonCircle } from 'react-icons/io5';
import {
  MdAlternateEmail,
  MdOutlineDangerous,
  MdOutlinePlace,
} from 'react-icons/md';
import axiosInstance from '../../../utils/axiosInstance';
import { LuWallet } from 'react-icons/lu';
import { formatCurrency } from '../../../helpers';

interface TenantInfo {
  id: string;
  name: string;
  email: string;
  stallNumber: string;
  totalBalance: number;
}

const fetchTenantInfo = async (tenantId: string): Promise<TenantInfo> => {
  const { data } = await axiosInstance.get<{ result: TenantInfo }>(
    `${import.meta.env.VITE_API_URL}/tenants/${tenantId}`
  );

  return data.result;
};

const TenantInfo = () => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const { tenantId } = useParams<{ tenantId: string }>();
  const { data, isLoading, isError, error } = useQuery<TenantInfo>({
    queryKey: ['tenant', tenantId],
    queryFn: () => fetchTenantInfo(tenantId as string),
  });

  const image = null;

  return (
    <>
      <div className='md:w-[30%] rounded-md border border-slate-200 bg-white h-full shadow-md mb-3'>
        <div className='flex justify-between rounded-t-md items-center py-3 px-5 border-b border-b-slate-200 shadow-md bg-slate-800 text-white'>
          <p className='text-md font-semibold'>Tenant Info</p>
          <Link to={`/inbox/m/${data?.id}`}>
            <AiOutlineMessage
              className='text-lg cursor-pointer'
              title='Message'
            />
          </Link>
        </div>

        <div className='flex-col flex justify-between items-center text-slate-800 py-5 px-5'>
          {isLoading ? (
            <div>Loading...</div>
          ) : isError ? (
            <div>Error: {(error as Error).message}</div>
          ) : (
            data && (
              <>
                {image ? (
                  <div className='h-[6rem] w-[6rem] rounded-full overflow-hidden'>
                    <img
                      className='overflow-hidden object-cover'
                      src='/elon.jpg' // Placeholder image, replace with data if available
                      height={150}
                      width={150}
                      alt={data?.name}
                    />
                  </div>
                ) : (
                  <IoPersonCircle size={120} />
                )}

                <p
                  title={data?.name}
                  className='font-medium text-center text-ellipsis text-lg text-slate-800 mt-2 overflow-hidden whitespace-nowrap w-[14rem]'
                >
                  {data?.name}
                </p>
                <p className='font-light text-xs text-slate-700 mt-2 flex gap-1'>
                  <MdAlternateEmail className='text-md text-slate-900' />
                  {data?.email}
                </p>
                <p className='font-light text-xs text-slate-700 mt-1 flex gap-1'>
                  <MdOutlinePlace className='text-md text-slate-900' />
                  {data?.stallNumber}
                </p>
                <p className='text-xs text-slate-700 font-semibold mt-1 flex gap-1'>
                  <LuWallet className='text-md text-slate-900' />
                  {formatCurrency(data?.totalBalance)}
                </p>
              </>
            )
          )}
        </div>

        <div className='flex justify-center gap-3 px-2 pb-5'>
          <div
            onClick={() => setIsDeleteModalOpen(true)}
            className='flex items-center text-white gap-1 button-red-gradient rounded-md px-3 cursor-pointer py-2 transition-all'
          >
            <MdOutlineDangerous size={18} />
            <p className='text-xs font-medium'>Deactivate</p>
          </div>
        </div>
      </div>
      <DeleteModal
        isDeleteModalOpen={isDeleteModalOpen}
        closeDeleteModal={() => setIsDeleteModalOpen(false)}
      />
    </>
  );
};

export default TenantInfo;
