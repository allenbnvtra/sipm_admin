import { ReactNode, useEffect, useState } from 'react';
import { IoIosClose } from 'react-icons/io';

interface SublinkProps {
  isOpen: boolean;
  onClose: () => void;
  title: string | null;
  children: ReactNode;
}

const Sublink = ({ isOpen, onClose, title, children }: SublinkProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      document.body.classList.add('overflow-hidden'); // Disable background scroll
    } else {
      setTimeout(() => setVisible(false), 300);
      document.body.classList.remove('overflow-hidden'); // Enable background scroll
    }
  }, [isOpen]);

  const handleOuterClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleOuterClick}
      className={`fixed inset-0 z-[1000] flex cursor-default items-end justify-center bg-black bg-opacity-30 duration-300 ${
        isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      {visible && (
        <div
          className={`z-[1000] w-full transform rounded-tl-2xl rounded-tr-2xl bg-white pt-1 text-slate-700 transition-transform duration-300 ${
            isOpen ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          <div className='flex items-center justify-between border-b px-4 py-3 text-sm'>
            <p className='font-semibold'>{title}</p>
            <IoIosClose className='cursor-pointer text-2xl' onClick={onClose} />
          </div>
          <div className='py-2'>{children}</div>
        </div>
      )}
    </div>
  );
};

export default Sublink;
