import { FaChevronDown } from 'react-icons/fa';
import { useState } from 'react';
import { cn } from './../../../utils/cn.tsx';
import { SidebarItems } from '../../../constants';
import { Link, useLocation } from 'react-router-dom';

const NavItems = () => {
  const [openDropdown, setOpenDropDown] = useState('');

  const location = useLocation();
  const pathname = location.pathname;

  const handleToggle = (label: string) => {
    setOpenDropDown(openDropdown === label ? '' : label);
  };

  return (
    <ul className='mt-6 w-full'>
      {SidebarItems.map(({ title, path, subLinks, icon: Icon }) => {
        const isActive =
          title &&
          (pathname === path ||
            pathname.startsWith(`/${title.toLowerCase()}/`));
        const hasSublinks = subLinks && subLinks.length > 0;

        return (
          <li key={title} className='mb-1'>
            {path ? (
              <Link
                to={path}
                className={cn(
                  'flex w-full cursor-pointer items-center gap-2 rounded-md px-4 py-4 text-xs text-slate-50 transition-all hover:bg-[#2a3768]',
                  {
                    'bg-[#2F3F72] text-slate-50 font-medium': isActive,
                  }
                )}
              >
                <Icon className='text-lg' /> {title}
              </Link>
            ) : (
              <p
                onClick={() => hasSublinks && handleToggle(title)}
                className={cn(
                  'flex w-full cursor-pointer items-center justify-between rounded-md px-4 py-4 text-xs text-slate-50 transition-all hover:bg-[#2a3768]',
                  {
                    'bg-[#2F3F72] text-slate-50': isActive,
                  }
                )}
              >
                <span className='flex gap-2'>
                  <Icon className='text-lg' />
                  {title}
                </span>

                {hasSublinks && (
                  <FaChevronDown
                    className={cn('text-xs transition-transform', {
                      'rotate-180': openDropdown === title,
                    })}
                  />
                )}
              </p>
            )}

            {hasSublinks && openDropdown === title && (
              <div className='relative ml-4'>
                <div className='absolute bottom-0 left-0 top-0 border-l border-slate-50'></div>
                <div className='ml-4 mt-1 flex flex-col gap-1'>
                  {subLinks.map(({ title, path }) => {
                    return (
                      <div key={title} className='relative flex items-center'>
                        <div className='absolute left-1 top-1/2 h-3 w-6 -translate-x-[80%] -translate-y-[90%] border-b border-slate-50'></div>
                        <Link
                          to={path}
                          className='flex w-full items-center gap-2 rounded-md px-4 py-2 text-slate-50 transition-all hover:bg-[#2a3768]'
                        >
                          <p className='text-xs font-medium'>{title}</p>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default NavItems;
