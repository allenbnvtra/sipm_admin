import { IoHomeSharp } from 'react-icons/io5';
import { Link } from 'react-router-dom';

const BillsPage = () => {
  return (
    <div className='sm:px-[6rem] md:px-0 lg:px-[2rem] xl:px-[6rem] mb-[-12px]'>
      <p className='text-xs text-slate-700 flex gap-2'>
        <Link to='/dashboard'>
          <IoHomeSharp size={15} />
        </Link>
        /<Link to='/tenants'>Tenants</Link>/ /
        <Link to='/tenants/'>Monthly Bill</Link>/
        <span className='text-green-600'>January 2025</span>
      </p>
    </div>
  );
};

export default BillsPage;
