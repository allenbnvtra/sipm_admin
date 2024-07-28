import { FaArchive } from 'react-icons/fa';
import { IoClose, IoWarning } from 'react-icons/io5';

interface DeleteModalProps {
  isDeleteModalOpen: boolean;
  closeDeleteModal: () => void;
}

const DeleteModal = ({
  isDeleteModalOpen,
  closeDeleteModal,
}: DeleteModalProps) => {
  return (
    <div
      className={`${
        isDeleteModalOpen ? 'visible' : 'invisible'
      } fixed inset-0 z-[1000] mx-2 flex items-center justify-center`}
    >
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${
          isDeleteModalOpen ? 'opacity-50' : 'opacity-0'
        }`}
      ></div>
      <div
        className={`z-[1000] mx-2 rounded-md bg-white p-1 transition-transform duration-200 ${
          isDeleteModalOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className='flex justify-end'>
          <button onClick={closeDeleteModal} className='text-lg text-gray-500'>
            <IoClose />
          </button>
        </div>

        <p className='mb-3 text-center font-semibold text-slate-800'>
          Archive tenant?
        </p>
        <p className='mb-3 text-center text-xs text-slate-600'>
          Are you sure you want to archive this tenant <br /> from the database?
        </p>

        <div className='p-2'>
          <div className='rounded-md bg-red-100 px-7 py-2 text-red-700'>
            <p className='flex items-center gap-1'>
              <IoWarning /> Warning
            </p>

            <p className='mt-2 text-xs'>
              This <span className='font-extrabold text-red-800'>3</span>{' '}
              tenant/s will be moved to archived and will be{' '}
              <br className='hidden xs:block' /> deleted permanently after 30
              days.
            </p>
          </div>
        </div>

        <div className='flex justify-center gap-4 py-4 text-xs'>
          <button
            onClick={closeDeleteModal}
            className='rounded-md border border-slate-300 px-4 py-2 text-slate-800'
          >
            Cancel
          </button>
          <button className='flex items-center gap-1 rounded-md bg-red-500 px-4 py-2 text-white'>
            <FaArchive /> Archive
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
