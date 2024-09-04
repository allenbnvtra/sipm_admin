import mongoose from 'mongoose';
import Payment from '../models/PaymentModel.js';

export const getTransactionById = async (req, res) => {
  try {
    const transactionId = req.params.transactionId;

    if (!mongoose.Types.ObjectId.isValid(transactionId)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid transaction ID',
      });
    }

    const transaction = await Payment.findById(transactionId);

    const result = {
      user: {
        userId: transaction.bill.user._id,
        name: transaction.bill.user.name,
        email: transaction.bill.user.email,
        stallNumber: transaction.bill.user.stallNumber,
      },
      bill: {
        billId: transaction.bill._id,
        billingPeriod: transaction.bill.billingPeriod,
      },
      receiptNumber: transaction.receiptNo,
      paymentAmount: transaction.paymentAmount,
      note: transaction.note,
      balance: transaction.balance,
      paymentDate: transaction.paymentDate,
    };

    if (!transaction) {
      return res.status(404).json({
        status: 'fail',
        message: 'Transaction not found',
      });
    }

    return res.status(200).json({
      status: 'success',
      result,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};
