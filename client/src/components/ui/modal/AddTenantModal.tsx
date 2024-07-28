import { useEffect } from 'react';
import { IoClose } from 'react-icons/io5';

interface AddTenantProps {
  isAddTenantModalOpen: boolean;
  closeAddTenantModal: () => void;
}

const AddTenantModal = ({
  isAddTenantModalOpen,
  closeAddTenantModal,
}: AddTenantProps) => {
  useEffect(() => {
    if (isAddTenantModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isAddTenantModalOpen]);

  return (
    <div
      className={`fixed inset-0 z-[1000] flex justify-end ${
        isAddTenantModalOpen ? 'visible' : 'invisible'
      }`}
    >
      <div
        className={`fixed inset-0 bg-black opacity-15 transition-opacity duration-300 ${
          isAddTenantModalOpen ? 'opacity-50' : 'opacity-0'
        }`}
      ></div>
      <div
        className={`z-[1000] m-2 transform rounded-md bg-white p-7 transition-transform duration-300 ${
          isAddTenantModalOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <button
          onClick={closeAddTenantModal}
          className='text-2xl text-gray-500'
        >
          <IoClose />
        </button>

        <div className='flex justify-center'>
          <p className='text-xl font-semibold text-slate-700'>Add New Tenant</p>
        </div>

        <div className='flex h-full flex-col justify-between'>
          <div className='mt-7 flex flex-col gap-2'>
            <div className='form_field'>
              <label htmlFor='name'>Name</label>
              <input
                className='form_input'
                type='text'
                name='name'
                id='name'
                placeholder='Enter Name'
              />
            </div>

            <div className='form_field'>
              <label htmlFor='stall_number'>Stall Number</label>
              <input
                className='form_input'
                type='text'
                name='stall_number'
                id='stall_number'
                placeholder='Enter Stall Number'
              />
            </div>

            <div className='form_field'>
              <label htmlFor='username'>Username</label>
              <input
                className='form_input'
                type='text'
                name='username'
                id='username'
                placeholder='Enter Username'
              />
            </div>

            <div className='form_field'>
              <label htmlFor='password'>Password</label>
              <input
                className='form_input'
                type='text'
                name='password'
                id='password'
                placeholder='********'
              />
            </div>

            <div className='form_field'>
              <label htmlFor='confirm_password'>Confirm Password</label>
              <input
                className='form_input'
                type='text'
                name='confirm_password'
                id='confirm_password'
                placeholder='********'
              />
            </div>
          </div>

          <div className='mb-14'>
            <button className='w-full rounded-md bg-indigo-600 py-2 font-semibold text-white hover:bg-indigo-700'>
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTenantModal;
