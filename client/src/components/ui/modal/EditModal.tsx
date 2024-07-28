import { IoClose } from 'react-icons/io5';

interface EditTenantProps {
  isEditTenantModalOpen: boolean;
  closeEditTenantModal: () => void;
}

const EditModal = ({
  isEditTenantModalOpen,
  closeEditTenantModal,
}: EditTenantProps) => {
  return (
    <div
      className={`fixed inset-0 z-[1000] flex justify-end ${
        isEditTenantModalOpen ? 'visible' : 'invisible'
      }`}
    >
      <div
        className={`fixed inset-0 bg-black opacity-15 transition-opacity ${
          isEditTenantModalOpen ? 'opacity-50' : 'opacity-0'
        }`}
      ></div>
      <div
        className={`z-[1000] m-2 transform rounded-md bg-white p-2 transition-transform duration-300 ${
          isEditTenantModalOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className='flex justify-between'>
          <p className='text-xl font-semibold text-slate-700'>Edit Tenant</p>
          <button
            onClick={closeEditTenantModal}
            className='text-2xl text-gray-500'
          >
            <IoClose />
          </button>
        </div>

        <div className=''>CONTENT HERE FOR EDIT MODAL</div>
      </div>
    </div>
  );
};

export default EditModal;
