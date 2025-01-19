import { IoMdNotificationsOutline } from 'react-icons/io';
import User from './User';
import { useEffect, useState } from 'react';

const Header = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);
  return (
    <div className='sticky top-0 z-[1000] flex w-full items-center justify-end bg-white shadow-sm px-3 py-4 text-slate-800 xs:justify-between md:px-6'>
      <p className='text-md hidden font-medium xs:block'>
        {currentTime.toLocaleDateString('en-US', {
          weekday: 'long', // "Monday"
          year: 'numeric', // "2024"
          month: 'long', // "July"
          day: 'numeric', // "24"
        })}{' '}
        {currentTime.toLocaleTimeString('en-US')}
      </p>

      <div className='flex items-center justify-end gap-2 text-2xl'>
        <User />
        <IoMdNotificationsOutline />
      </div>
    </div>
  );
};

export default Header;
