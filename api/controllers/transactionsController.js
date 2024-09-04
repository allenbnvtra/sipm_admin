import mongoose from 'mongoose';
import Payment from '../models/paymentModel.js';

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

    if (!transaction) {
      return res.status(404).json({
        status: 'fail',
        message: 'Transaction not found',
      });
    }

    const previousTransaction = await Payment.findOne({
      bill: transaction.bill._id,
      _id: { $lt: transaction._id },
    }).sort({ _id: -1 });

    console.log(previousTransaction);

    const previousBalance = previousTransaction
      ? previousTransaction.balance
      : transaction.bill.currentBill;

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
        totalConsumption: transaction.bill.totalConsumption,
        amountPerConsumption: transaction.bill.amountPerConsumption,
        currentBill: transaction.bill.currentBill,
      },
      receiptNumber: transaction.receiptNo,
      paymentAmount: transaction.paymentAmount,
      note: transaction.note,
      previousBalance,
      balance: transaction.balance,
      paymentDate: transaction.paymentDate,
    };

    return res.status(200).json({
      status: 'success',
      result,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};
