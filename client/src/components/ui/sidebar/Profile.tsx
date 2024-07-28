import { useState } from 'react';
import { IoPersonCircle } from 'react-icons/io5';
import { MdOutlineKeyboardArrowDown, MdLogout } from 'react-icons/md';
import { CgProfile } from 'react-icons/cg';
import { cn } from './../../../utils/cn.tsx';
import { Link } from 'react-router-dom';

const Profile = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className='relative w-full'>
      {isDropdownOpen && (
        <div className='absolute bottom-full right-0 mb-2 w-48 rounded-md border-gray-200 bg-white shadow-lg'>
          <Link to='/profile'>
            <p className='flex items-center gap-1 px-4 py-4 text-xs text-gray-800 hover:bg-gray-100'>
              <CgProfile className='text-lg' />
              My Profile
            </p>
          </Link>
          <Link to='/'>
            <p className='flex items-center gap-1 px-4 py-4 text-xs text-gray-800 hover:bg-gray-100'>
              <MdLogout className='text-lg' />
              Logout
            </p>
          </Link>
        </div>
      )}
      <div
        className='flex w-full cursor-pointer items-center rounded-md bg-indigo-100 p-1'
        onClick={toggleDropdown}
      >
        <IoPersonCircle className='mr-1 text-5xl text-[#1c3153]' />
        <div className='flex w-full items-center justify-between pr-2'>
          <div className='text-xs'>
            <p className='font-semibold text-slate-800'>Allen Buenaventura</p>
            <p className='text-xs font-light text-slate-700'>@allenbnvtra</p>
          </div>
          <div className='rounded-full bg-indigo-200 p-1'>
            <MdOutlineKeyboardArrowDown
              className={cn('text-xl text-slate-700 transition-transform', {
                'rotate-180': isDropdownOpen,
              })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
