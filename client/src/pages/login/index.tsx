import axios from 'axios';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setAuth } from '../../redux/slices/userSlice';

interface IFormInput {
  email: string;
  password: string;
}

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const toastId = toast.loading('Logging in...');
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        data,
        { withCredentials: true }
      );

      if (response.status === 200) {
        const { accessToken } = response.data;
        const { _id, email, name } = response.data.result;

        localStorage.setItem('token', accessToken);

        dispatch(
          setAuth({ token: accessToken, user: { id: _id, email, name } })
        );
        toast.success('Logged in successfully!', { id: toastId });
        navigate('/dashboard');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          'Login failed. Please check your credentials and try again.';
        toast.error(errorMessage, { id: toastId });
      } else {
        toast.error('An unexpected error occurred. Please try again.', {
          id: toastId,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const token = useAppSelector((state) => state.user.token);
  const isAuthenticated = token;

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className='flex h-screen'>
      <div className='md:w-[65%] hidden md:block'>
        <div className='h-full w-full overflow-hidden'>
          <img
            className='h-full w-full object-cover blur-[0.5px]'
            src='/new-municipal.jpg'
            alt='SI Municipal'
          />
        </div>
      </div>
      <div className='flex w-full px-3 md:w-[35%] justify-center items-center'>
        <div className='md:w-[75%]'>
          <div className='flex gap-1 flex-col items-center justify-center'>
            <img src='/si-logo.png' height={80} width={80} alt='SI Logo' />
            <h3 className='text-center text-3xl font-semibold text-slate-800'>
              SIPM Management System
            </h3>
            <p className='text-center text-md font-normal text-slate-800 opacity-75'>
              Welcome to our new and improved SIPM Management System.
            </p>
          </div>

          <form
            className='mt-8 flex flex-col'
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className='flex flex-col mb-4 gap-2'>
              <label className='text-md text-slate-800' htmlFor='email'>
                Email <span className='text-red-500'>*</span>
              </label>
              <input
                className='border border-slate-300 rounded-md p-3 text-xs focus:outline-none'
                type='text'
                placeholder='Enter your email'
                {...register('email', {
                  required: 'Email/Username is required',
                })}
              />
              {errors.email && (
                <span className='text-red-500 text-xs'>
                  {errors.email.message ?? 'Error'}
                </span>
              )}
            </div>

            <div className='flex flex-col gap-2 mb-4'>
              <label className='text-md text-slate-800' htmlFor='password'>
                Password <span className='text-red-500'>*</span>
              </label>
              <input
                className='border border-slate-300 rounded-md p-3 text-xs focus:outline-none'
                type='password'
                placeholder='Enter your password'
                {...register('password', { required: 'Password is required' })}
              />
              {errors.password && (
                <span className='text-red-500 text-xs'>
                  {errors.password.message ?? 'Error'}
                </span>
              )}
            </div>

            <div className='flex gap-1 items-center mb-5'>
              <input
                type='checkbox'
                className='cursor-pointer h-4 w-4'
                name='remember-me'
                id='remember-me'
              />
              <label className='text-md text-slate-800' htmlFor='remember-me'>
                Remember me
              </label>
            </div>

            <button
              type='submit'
              className={`bg-indigo-800 text-white text-sm py-3 rounded-md ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
