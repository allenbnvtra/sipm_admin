import { useEffect, useState } from 'react';
import { IoClose, IoPersonCircleSharp } from 'react-icons/io5';

interface AddTenantProps {
  isAddTenantModalOpen: boolean;
  closeAddTenantModal: () => void;
}

const AddTenantModal = ({
  isAddTenantModalOpen,
  closeAddTenantModal,
}: AddTenantProps) => {
  const [selectedProfileImage, setSelectedProfileImage] = useState<
    string | null
  >(null);

  const handleProfileImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedProfileImage(imageUrl);
    }
  };

  const renderProfileIcon = () => {
    if (selectedProfileImage) {
      return (
        <img
          src={selectedProfileImage}
          alt='Profile'
          className='rounded-full w-28 h-28 object-cover'
        />
      );
    }
    return <IoPersonCircleSharp size={110} />;
  };

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

        <div className='flex flex-col justify-between'>
          <div className='mt-3 flex flex-col gap-2'>
            <div className='flex justify-center cursor-pointer'>
              <div className='text-center flex flex-col items-center'>
                {renderProfileIcon()}
                <div className='flex justify-center mt-2'>
                  <input
                    type='file'
                    accept='image/*'
                    onChange={handleProfileImageChange}
                    className='hidden'
                    id='profileImageInput'
                  />
                  <label
                    htmlFor='profileImageInput'
                    className='cursor-pointer px-4 py-2 border rounded text-xs text-indigo-600 border-indigo-600 hover:bg-indigo-600 hover:text-white transition'
                  >
                    Upload Profile Image
                  </label>
                </div>
              </div>
            </div>
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

          <div className='mt-7'>
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
