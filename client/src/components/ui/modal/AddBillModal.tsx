import { useEffect } from 'react';
import { IoClose } from 'react-icons/io5';

interface AddBillModalProps {
  meterNumber: string;
  previousReading: number;
  isAddBillModalOpen: boolean;
  closeAddBillModal: () => void;
}

const AddBillModal = ({
  meterNumber,
  previousReading,
  isAddBillModalOpen,
  closeAddBillModal,
}: AddBillModalProps) => {
  useEffect(() => {
    if (isAddBillModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isAddBillModalOpen]);

  return (
    <div
      className={`${
        isAddBillModalOpen ? 'visible' : 'invisible'
      } fixed inset-0 z-[1000] mx-2 flex items-center justify-center`}
    >
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${
          isAddBillModalOpen ? 'opacity-50' : 'opacity-0'
        }`}
      ></div>
      <div
        className={`z-[1000] mx-2 rounded-md bg-white p-1 transition-transform duration-200 ${
          isAddBillModalOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className='flex justify-end'>
          <button onClick={closeAddBillModal} className='text-lg text-gray-500'>
            <IoClose />
          </button>
        </div>

        <form className='px-4'>
          <div className='form_field mb-4'>
            <label htmlFor='meter_number' className='text-center'>
              Meter Number
            </label>
            <br />
            <input
              className='w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-transparent'
              type='text'
              id='meter_number'
              name='meter_number'
              placeholder='Enter meter number'
              value={meterNumber}
            />
          </div>

          <div className='flex gap-2'>
            <div className='form_field'>
              <label htmlFor='previous_reading'>Previous Reading</label>
              <br />
              <input
                className='w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-transparent'
                type='number'
                id='previous_reading'
                name='previous_reading'
                style={{ appearance: 'textfield' }}
                placeholder='Enter previous reading'
                value={previousReading}
              />
            </div>
            <div className='form_field'>
              <label htmlFor='current_reading'>Current Reading</label>
              <br />
              <input
                className='w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-transparent'
                type='number'
                id='current_reading'
                name='current_reading'
                style={{ appearance: 'textfield' }}
                placeholder='Enter current reading'
              />
            </div>
          </div>

          <div className='flex gap-2 mt-4'>
            <div className='form_field w-1/2'>
              <label htmlFor='billing_period'>Billing Period</label>
              <br />
              <input
                className='w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-transparent'
                type='date'
                id='billing_period'
                name='billing_period'
                placeholder='mm/dd/yyyy'
                pattern='\d{2}/\d{2}/\d{4}'
              />
            </div>
            <div className='form_field w-1/2'>
              <label htmlFor='amount_per_consumption'>
                Amount Per Consumption
              </label>
              <br />
              <div className='relative'>
                <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500'>
                  ₱
                </span>
                <input
                  className='w-full pl-6 pr-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-transparent'
                  type='number'
                  id='amount_per_consumption'
                  name='amount_per_consumption'
                  style={{ appearance: 'textfield' }}
                  placeholder='0.00'
                />
              </div>
            </div>
          </div>

          <div className='mt-5 text-sm text-slate-700'>
            <p>
              Total Consumption :{' '}
              <span className='font-semibold text-slate-900'>199 kWh</span>
            </p>
            <p>
              Amount :{' '}
              <span className='font-semibold text-slate-900'>PHP 199.30</span>
            </p>
          </div>

          <div className='flex justify-center mt-5 mb-3'>
            <button className='bg-green-600 text-white px-8 py-2 rounded-full font-medium button-green-gradient'>
              Proceed
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBillModal;
