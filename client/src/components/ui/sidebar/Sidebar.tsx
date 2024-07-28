import NavItems from './NavItems';
import Profile from './Profile';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className='sticky left-0 top-0 hidden !h-screen w-[17rem] bg-slate-50 md:block'>
      <nav className='flex h-full flex-col items-center justify-between border px-2 py-5 shadow-lg'>
        <div className='w-full'>
          <Link
            to={'/dashboard'}
            className='flex flex-col items-center justify-center'
          >
            <img src='/si-logo.png' height={70} width={70} alt='' />
            <span className='mt-2 rounded-xl bg-[#1c3153] px-4 py-2 text-center text-sm font-semibold text-white'>
              SIPM Management System
            </span>
          </Link>

          <NavItems />
        </div>

        <Profile />
      </nav>
    </div>
  );
};

export default Sidebar;
