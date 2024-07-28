import { FaRegListAlt } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';

interface ViewBillsModalProps {
  isViewBillsModalOpen: boolean;
  closeViewBillsModal: () => void;
}

const ViewBillsModal = ({
  isViewBillsModalOpen,
  closeViewBillsModal,
}: ViewBillsModalProps) => {
  return (
    <div
      className={`${
        isViewBillsModalOpen ? 'visible' : 'invisible'
      } fixed inset-0 z-[1000] mx-2 flex items-center justify-center`}
    >
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${
          isViewBillsModalOpen ? 'opacity-50' : 'opacity-0'
        }`}
      ></div>
      <div
        className={`z-[1000] mx-2 rounded-md bg-white p-1 transition-transform duration-200 ${
          isViewBillsModalOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className='flex justify-end'>
          <button
            onClick={closeViewBillsModal}
            className='text-lg text-gray-500'
          >
            <IoClose />
          </button>
        </div>

        <div className='relative z-0 mt-4 h-[26.1rem] overflow-hidden rounded-md border border-slate-300 bg-white shadow-md'>
          <div className='h-[calc(100%-3rem)] overflow-y-auto scrollbar-hide'>
            <table className='w-full'>
              <thead className='sticky top-0 text-sm'>
                <tr>
                  <th className='t_head w-[15%]'>ID</th>
                  <th className='t_head w-[20%]'>Name</th>
                  <th className='t_head w-[15%] whitespace-nowrap'>
                    Stall No.
                  </th>
                  <th className='t_head w-[20%]'>Username</th>
                  <th className='t_head w-[15%]'>Balance</th>
                  <th className='t_head w-[10%]'>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className='border-b border-b-slate-300'>
                  <td className='t_column'></td>
                  <td className='t_column'></td>
                  <td className='t_column'></td>
                  <td className='t_column'></td>
                  <td className='t_column'>&#8369;</td>
                  <td className='flex items-center justify-center gap-2 py-3 text-lg md:text-[16px]'>
                    <FaRegListAlt
                      // onClick={() => setIsModalOpen(true)}
                      title='View Bills'
                      className='cursor-pointer text-blue-700'
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className='absolute bottom-0 left-0 w-full rounded-b-md bg-slate-600 text-white'>
            {/* <div className='flex w-full items-center gap-3 border-t px-5 py-4 text-xs'>
              <p>
                {(page - 1) * 10 + 1}-{Math.min(page * 10, totalUsersCount)} of{' '}
                {totalUsersCount}
              </p>
              <div className='flex gap-3 text-sm'>
                <p
                  className='cursor-pointer'
                  onClick={() => handlePageChange(page - 1)}
                >
                  <FaAngleLeft />
                </p>
                <p
                  className='cursor-pointer'
                  onClick={() => handlePageChange(page + 1)}
                >
                  <FaAngleRight />
                </p>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewBillsModal;
