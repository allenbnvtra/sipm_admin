import { AiOutlineMessage } from 'react-icons/ai';
import { FaArchive, FaEdit } from 'react-icons/fa';
import { MdAlternateEmail, MdOutlinePlace } from 'react-icons/md';

const TenantInfo = () => {
  return (
    <div className='md:w-[30%] rounded-md border border-slate-200 bg-white h-full shadow-md mb-3'>
      <div className='flex justify-between rounded-t-md items-center py-3 px-5 border-b border-b-slate-200 shadow-md bg-slate-800 text-white'>
        <p className='text-md font-semibold'>Tenant Info</p>
        <AiOutlineMessage className='text-lg cursor-pointer' title='Message' />
      </div>

      <div className='flex-col flex justify-between items-center  text-slate-800 py-5 px-5'>
        <div className='h-[6rem] w-[6rem] rounded-full overflow-hidden'>
          <img
            className='overflow-hidden object-cover'
            src='/elon.jpg'
            height={150}
            width={150}
            alt=''
          />
        </div>

        <p className='font-medium text-lg text-slate-800 mt-2'>Elon Musk</p>
        <p className='font-light text-xs text-slate-700 mt-2 flex gap-1'>
          <MdAlternateEmail className='text-md text-slate-900' />
          elon_musk
        </p>
        <p className='font-light text-xs text-slate-700 mt-1 flex gap-1'>
          <MdOutlinePlace className='text-md text-slate-900' />
          PRO 1, 2, 3
        </p>
      </div>

      <div className='flex justify-center gap-3 px-2 pb-5'>
        <div className='flex items-center text-blue-600 gap-1 bg-blue-200 rounded-md px-3 cursor-pointer py-2 hover:bg-blue-300 transition-all'>
          <FaEdit size={15} />
          <p className='text-xs font-medium'>Edit</p>
        </div>
        <div className='flex items-center text-red-600 gap-1 bg-red-200 rounded-md px-3 cursor-pointer py-2 hover:bg-red-300 transition-all'>
          <FaArchive size={14} />
          <p className='text-xs font-medium'>Archive</p>
        </div>
      </div>
    </div>
  );
};

export default TenantInfo;
