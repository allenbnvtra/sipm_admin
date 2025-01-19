import NavItems from './NavItems';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className='sticky left-0 top-0 hidden !h-screen w-[17rem] bg-[#202a4e] md:block'>
      <nav className='flex h-full flex-col items-center justify-between px-2 py-5'>
        <div className='w-full'>
          <Link
            to={'/dashboard'}
            className='flex flex-col items-center justify-center'
          >
            <img src='/si-logo.png' height={70} width={70} alt='' />
            <span className='mt-2 text-center text-md font-semibold text-white'>
              SIPM Management System
            </span>
            <div className='w-[90%] border-b border-b-slate-600 mt-5'></div>
          </Link>

          <NavItems />
        </div>

        {/* <Profile /> */}
      </nav>
    </div>
  );
};

export default Sidebar;
