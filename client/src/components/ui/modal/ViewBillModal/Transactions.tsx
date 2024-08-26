interface TransactionsProps {
  closeTransactionModal: () => void;
}

const Transactions = ({ closeTransactionModal }: TransactionsProps) => {
  return (
    <div className='h-[25rem]'>
      <div className='flex justify-between items-center mb-4'>
        <button
          onClick={closeTransactionModal}
          className='text-sm text-slate-500'
        >
          ← Back
        </button>
        <h2 className='text-lg font-semibold'>Transactions</h2>
      </div>
      <div className='text-slate-800 h-[90%] w-full flex justify-center items-center'>
        <p>No transactions found.</p>
      </div>
    </div>
  );
};

export default Transactions;
