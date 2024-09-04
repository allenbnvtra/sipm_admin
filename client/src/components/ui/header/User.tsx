import { useState } from 'react';
import { CgProfile } from 'react-icons/cg';
import { IoPersonCircleSharp } from 'react-icons/io5';
import { MdLogout, MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { logout } from '../../../redux/slices/userSlice';

const User = () => {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { email } = useAppSelector((state) => state.user.user);

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const handleLogout = () => {
    dispatch(logout());

    localStorage.removeItem('token');

    navigate('/');
  };

  return (
    <div
      className='relative flex cursor-pointer items-center gap-5 rounded-full bg-[#244371a3] p-1 transition-all shadow-2xl hover:bg-[#375480a3]'
      onClick={toggleUserDropdown}
    >
      <div className='flex items-center gap-1'>
        <IoPersonCircleSharp className='text-2xl' />
        <p className='text-xs w-[3.7rem] overflow-hidden whitespace-nowrap text-ellipsis lowercase'>
          {email}
        </p>
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
          <p
            className='flex items-center gap-1 px-4 py-3 text-xs text-gray-800 hover:rounded-b-md hover:bg-gray-100 cursor-pointer'
            onClick={handleLogout}
          >
            <MdLogout className='text-lg' />
            Logout
          </p>
        </div>
      )}
    </div>
  );
};

export default User;
