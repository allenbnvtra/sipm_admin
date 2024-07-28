import { useState } from 'react';
import { CgProfile } from 'react-icons/cg';

import { IoPersonCircleSharp } from 'react-icons/io5';
import { MdLogout, MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { Link } from 'react-router-dom';

const User = () => {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };
  return (
    <div
      className='relative flex cursor-pointer items-center gap-5 rounded-full bg-[#244371a3] p-1 transition-all shadow-2xl hover:bg-[#375480a3]'
      onClick={toggleUserDropdown}
    >
      <div className='flex items-center gap-1'>
        <IoPersonCircleSharp className='text-2xl' />
        <p className='text-xs'>allenbnvtra</p>
      </div>
      <MdOutlineKeyboardArrowDown />
      {isUserDropdownOpen && (
        <div className='absolute right-2 top-1 mt-9 w-48 rounded-md bg-white text-sm text-black shadow-lg'>
          <Link to='/profile'>
            <p className='flex items-center gap-1 px-4 py-3 text-xs text-gray-800 hover:rounded-t-md hover:bg-gray-100 border-b'>
              <CgProfile className='text-lg' />
              My Profile
            </p>
          </Link>
          <Link to='/'>
            <p className='flex items-center gap-1 px-4 py-3 text-xs text-gray-800 hover:rounded-b-md hover:bg-gray-100'>
              <MdLogout className='text-lg' />
              Logout
            </p>
          </Link>
        </div>
      )}
    </div>
  );
};

export default User;
