import { FaRegEdit } from 'react-icons/fa';
import { GoDotFill } from 'react-icons/go';
import { IoSearchSharp } from 'react-icons/io5';
import Messages from '../../components/ui/inbox/Messages';

const InboxPage = () => {
  return (
    <div className='flex h-[39rem] rounded-md border bg-white shadow-md'>
      <div className='w-[18rem] max-w-[18rem] border-r pr-1 shadow-md'>
        <div className='flex flex-col p-2'>
          <div className='mb-3 flex w-full items-center justify-between'>
            <FaRegEdit
              className='text-lg cursor-pointer text-indigo-600'
              title='New Message'
            />
          </div>

          <div className='relative mb-5'>
            <input
              type='search'
              placeholder='Search Name...'
              className='rounded-md bg-slate-200 py-2 pl-9 pr-3 text-xs text-slate-700 focus:outline-none sm:w-full'
            />
            <IoSearchSharp className='absolute left-4 top-[8px] text-slate-500' />
          </div>

          {/* MESSAGE */}
          <div className='mb-1 flex h-[3.3rem] cursor-pointer items-center justify-between rounded-md bg-indigo-100 px-2'>
            <div className='flex items-center'>
              <div className='h-10 w-10 overflow-hidden rounded-full'>
                <img
                  src='/cj.jpg'
                  height={45}
                  width={45}
                  alt='profile'
                  className='object-cover'
                />
              </div>
              <div className='ml-1 flex h-full items-center justify-between gap-2 py-1 text-xs font-light'>
                <div className='flex flex-col gap-1'>
                  <p className='max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap font-semibold text-slate-800'>
                    Elon Musk
                  </p>
                  <p className='max-w-[130px] overflow-hidden text-ellipsis whitespace-nowrap text-slate-700'>
                    You: Hey bro are you free tonight?
                  </p>
                </div>
                <p className='text-xs'> · 1h</p>
              </div>
            </div>
          </div>

          {/* MESSAGE */}
          <div className='hover:bg-indigo-45 mb-1 flex h-[3.3rem] cursor-pointer items-center justify-between rounded-md p-2 hover:bg-indigo-50'>
            <div className='flex items-center'>
              <div className='h-10 w-10 overflow-hidden rounded-full'>
                <img
                  src='/profile.jpg'
                  height={45}
                  width={45}
                  alt='profile'
                  className='object-cover'
                />
              </div>
              <div className='ml-1 flex h-full items-center justify-between gap-2 py-1 text-xs font-light'>
                <div className='flex flex-col gap-1'>
                  <p className='max-w-[135px] overflow-hidden text-ellipsis whitespace-nowrap font-semibold text-slate-800'>
                    Cardo DC. Dalisay
                  </p>
                  <p className='max-w-[135px] overflow-hidden text-ellipsis whitespace-nowrap font-medium text-indigo-700'>
                    Kamusta ka allen?
                  </p>
                </div>
                <p className='text-xs font-medium text-indigo-700'> · 1h</p>
              </div>
            </div>

            <GoDotFill className='text-indigo-700' />
          </div>
        </div>
      </div>
      <Messages />
    </div>
  );
};

export default InboxPage;
