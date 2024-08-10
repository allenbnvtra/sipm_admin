import { GoDotFill } from 'react-icons/go';
import { IoIosSearch, IoMdMore } from 'react-icons/io';
import { IoSend } from 'react-icons/io5';

const formatDate = (date: Date) => {
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
};

const Messages = () => {
  const currentDate = new Date();

  return (
    <div className='w-full flex flex-col h-full'>
      <div className='flex items-center justify-between border-b p-3 shadow-sm'>
        <div className='flex'>
          <div className='h-8 w-8 overflow-hidden rounded-full'>
            <img
              src='/cj.jpg'
              height={38}
              width={38}
              alt='profile'
              className='object-cover'
            />
          </div>
          <div className='ml-2'>
            <p className='text-sm font-light text-slate-800'>Elon Musk</p>
            <p className='flex items-center text-xs font-light text-slate-600'>
              <GoDotFill className='text-green-700' />
              Active Now
            </p>
          </div>
        </div>
        <div className='flex gap-1 text-xl'>
          <IoIosSearch className='cursor-pointer' />
          <IoMdMore className='cursor-pointer' />
        </div>
      </div>

      <div className='flex flex-col flex-1 p-3 space-y-2 overflow-y-auto'>
        <div className='flex'>
          <div>
            <p className='bg-slate-100 text-slate-800 border-slate-200 flex border rounded-xl px-2 py-1 text-sm mb-2'>
              hello malupitan na to now na HAHAHA
            </p>
            <p className='text-xs text-slate-500 text-left pl-2'>
              {formatDate(currentDate)}
            </p>
          </div>
        </div>
        <div className='flex justify-end'>
          <div>
            <p className='bg-indigo-200 text-slate-800 border-indigo-300 border rounded-xl px-2 py-1 text-sm mb-2'>
              hi ano kamusta kana jan sa space x
            </p>
            <p className='text-xs text-slate-500 text-right pr-2'>
              {formatDate(currentDate)}
            </p>
          </div>
        </div>
        {/* Add more messages here */}
      </div>

      <div className='h-[4rem] flex gap-3 items-center p-3 border-t shadow-lg'>
        <input
          type='text'
          placeholder='Type your message...'
          className='flex-1 p-2 border rounded-2xl text-xs text-slate-800 focus:outline-none'
        />
        <div className='rounded-full cursor-pointer hover:bg-slate-100 transition-all p-2 flex justify-center'>
          <IoSend size={21} />
        </div>
      </div>
    </div>
  );
};

export default Messages;
