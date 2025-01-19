import { useState } from 'react';
import { IoPersonCircle } from 'react-icons/io5';
import { MdOutlineKeyboardArrowDown, MdLogout } from 'react-icons/md';
import { CgProfile } from 'react-icons/cg';
import { cn } from './../../../utils/cn.tsx';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks.ts';
import { logout } from '../../../redux/slices/userSlice.ts';

const Profile = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    dispatch(logout());

    localStorage.removeItem('user');
    localStorage.removeItem('token');

    navigate('/');
  };

  const { email, name } = useAppSelector((state) => state.user.user);

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
          <div onClick={handleLogout}>
            <p className='flex items-center gap-1 px-4 py-4 text-xs text-gray-800 hover:bg-gray-100'>
              <MdLogout className='text-lg' />
              Logout
            </p>
          </div>
        </div>
      )}
      <div
        className='flex w-full cursor-pointer items-center rounded-md bg-[#161d38] p-1'
        onClick={toggleDropdown}
      >
        <IoPersonCircle className='mr-1 text-5xl text-[#ededed]' />
        <div className='flex w-full items-center justify-between pr-2'>
          <div className='text-xs flex-1 overflow-hidden'>
            <p className='font-semibold w-[7rem] text-slate-200 overflow-hidden whitespace-nowrap text-ellipsis capitalize'>
              {name}
            </p>
            <p className='text-xs w-[7rem] font-light text-slate-200 overflow-hidden whitespace-nowrap text-ellipsis lowercase'>
              @{email}
            </p>
          </div>
          <div className='rounded-full bg-white p-1'>
            <MdOutlineKeyboardArrowDown
              className={cn('text-xl text-slate-800 transition-transform', {
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
