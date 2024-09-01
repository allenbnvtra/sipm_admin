import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { IoClose, IoPersonCircleSharp } from 'react-icons/io5';
import axiosInstance from '../../../utils/axiosInstance';
import toast from 'react-hot-toast';

interface AddTenantProps {
  isAddTenantModalOpen: boolean;
  closeAddTenantModal: () => void;
}

interface FormData {
  name: string;
  email: string;
  stallNumber: string;
  imageUrl: string;
  password: string;
  confirmPassword: string;
}

interface NewTenantResponse {
  status: string;
  message: string;
  result?: object;
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

  const [selectedProfileImage, setSelectedProfileImage] = useState<
    string | null
  >(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const mutation: UseMutationResult<NewTenantResponse, Error, FormData> =
    useMutation({
      mutationFn: async (formData: FormData) => {
        const response = await axiosInstance.post(`/api/v1/tenants`, formData);
        return response.data;
      },
      onSuccess: () => {
        reset();
        closeAddTenantModal();
      },
      onError: (error: Error) => {
        console.error('Adding Tenant failed: ', error.message);
      },
    });

  // const handleProfileImageChange = (
  //   event: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   const files = event.target.files;
  //   if (files && files[0]) {
  //     const file = files[0];
  //     const imageUrl = URL.createObjectURL(file);
  //     setSelectedProfileImage(imageUrl);
  //   }
  // };

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

  const onSubmit = (formData: FormData) => {
    const loadingId = toast.loading('Processing...');

    mutation.mutate(formData, {
      onSuccess: (data) => {
        toast.success(data.message, { id: loadingId });
      },
      onError: () => {
        toast.error('Adding tenant failed. Please try again.', {
          id: loadingId,
        });
      },
    });
  };

  const isLoading = mutation.status === 'pending';

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

        <form
          onSubmit={handleSubmit(onSubmit)}
          className='flex flex-col justify-between'
        >
          <div className='mt-3 flex flex-col gap-2'>
            <div className='flex justify-center cursor-pointer'>
              <div className='text-center flex flex-col items-center'>
                {renderProfileIcon()}
                <div className='flex justify-center mt-2'>
                  <input
                    type='file'
                    // {...register('imageUrl')}
                    accept='image/*'
                    // onChange={handleProfileImageChange}
                    className='hidden'
                  />
                  <label className='cursor-pointer px-4 py-2 border rounded text-xs text-indigo-600 border-indigo-600 hover:bg-indigo-600 hover:text-white transition'>
                    Upload Profile Image
                  </label>
                </div>
              </div>
            </div>
            <div className='form_field'>
              <label>Name</label>
              <input
                className='form_input'
                {...register('name', { required: true })}
                type='text'
                placeholder='Enter Name'
                disabled={isLoading}
              />
            </div>
            {errors.name && (
              <p className='text-red-500 text-xs'>Name is required</p>
            )}

            <div className='form_field'>
              <label>Stall Number</label>
              <input
                className='form_input'
                {...register('stallNumber', { required: true })}
                type='text'
                placeholder='Enter Stall Number'
                disabled={isLoading}
              />
            </div>
            {errors.stallNumber && (
              <p className='text-red-500 text-xs'>Stall Number is required</p>
            )}

            <div className='form_field'>
              <label>Username</label>
              <input
                className='form_input'
                {...register('email', { required: true })}
                type='text'
                placeholder='Enter Username'
                disabled={isLoading}
              />
            </div>
            {errors.email && (
              <p className='text-red-500 text-xs'>Email is required</p>
            )}

            <div className='form_field'>
              <label>Password</label>
              <input
                className='form_input'
                {...register('password', { required: true, minLength: 8 })}
                type='text'
                placeholder='********'
                disabled={isLoading}
              />
            </div>
            {errors.password && (
              <p className='text-red-500 text-xs'>Password is required</p>
            )}

            <div className='form_field'>
              <label>Confirm Password</label>
              <input
                className='form_input'
                {...register('confirmPassword', {
                  required: true,
                  minLength: 8,
                })}
                type='text'
                placeholder='********'
                disabled={isLoading}
              />
            </div>
            {errors.confirmPassword && (
              <p className='text-red-500 text-xs'>
                Confirm password is required
              </p>
            )}
          </div>

          <div className='mt-7'>
            <button
              className='w-full rounded-md bg-indigo-600 py-2 font-semibold text-white hover:bg-indigo-700'
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTenantModal;
