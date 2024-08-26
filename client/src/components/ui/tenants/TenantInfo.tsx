import DeleteModal from '../modal/DeleteModal';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { AiOutlineMessage } from 'react-icons/ai';
import { FaArchive, FaEdit } from 'react-icons/fa';
import { IoPersonCircle } from 'react-icons/io5';
import { CiEdit } from 'react-icons/ci';
import { MdAlternateEmail, MdOutlinePlace } from 'react-icons/md';
import axiosInstance from '../../../utils/axiosInstance';

interface TenantInfo {
  id: string;
  name: string;
  email: string;
  stallNumber: string;
}

const fetchTenantInfo = async (tenantId: string): Promise<TenantInfo> => {
  const { data } = await axiosInstance.get<{ result: TenantInfo }>(
    `${import.meta.env.VITE_API_URL}/tenants/${tenantId}`
  );

  return data.result;
};

const TenantInfo = () => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isEditable, setIsEditable] = useState<boolean>(false);

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
                  className='flex justify-center gap-1 items-center font-medium text-center text-ellipsis text-lg text-slate-800 mt-2 overflow-hidden whitespace-nowrap w-[14rem]'
                >
                  {data?.name} {isEditable && <CiEdit size={18} />}
                </p>
                <p className='font-light text-xs text-slate-700 mt-2 flex gap-1'>
                  <MdAlternateEmail className='text-md text-slate-900' />
                  {data?.email} {isEditable && <CiEdit size={18} />}
                </p>
                <p className='font-light text-xs text-slate-700 mt-1 flex gap-1'>
                  <MdOutlinePlace className='text-md text-slate-900' />
                  {data?.stallNumber} {isEditable && <CiEdit size={18} />}
                </p>
              </>
            )
          )}
        </div>

        <div className='flex justify-center gap-3 px-2 pb-5'>
          <div
            // onClick={() => setIsEditable(!isEditable)}
            className='flex items-center text-blue-600 gap-1 bg-blue-200 rounded-md px-3 cursor-pointer py-2 hover:bg-blue-300 transition-all'
          >
            <FaEdit size={15} />
            <p className='text-xs font-medium'>
              {isEditable ? 'Cancel' : 'Edit'}
            </p>
          </div>
          <div
            onClick={() => setIsDeleteModalOpen(true)}
            className='flex items-center text-red-600 gap-1 bg-red-200 rounded-md px-3 cursor-pointer py-2 hover:bg-red-300 transition-all'
          >
            <FaArchive size={14} />
            <p className='text-xs font-medium'>Archive</p>
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
