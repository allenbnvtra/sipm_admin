import mongoose from 'mongoose';
import Month from '../models/monthlyModel.js';
import Payment from '../models/paymentModel.js';

export const getAllBills = async (req, res) => {
  try {
    const bill = await Month.find();

    return res.status(200).json({
      status: 'success',
      result: bill,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};

export const getBill = async (req, res) => {
  try {
    const bill = await Month.findById(req.params.billId);

    const result = {
      billId: bill._id,
      user: bill.user,
      meterNumber: bill.meterNumber,
      currentBill: bill.currentBill,
      currentReading: bill.currentReading,
      previousReading: bill.previousReading,
      totalConsumption: bill.totalConsumption,
      status: bill.status,
      billingPeriod: bill.billingPeriod,
      remainingBalance: bill.remainingBalance,
      totalPaid: bill.totalPaid,
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

export const getBillTransactions = async (req, res) => {
  try {
    const transactions = await Payment.find({ bill: req.params.billId });

    const result = transactions.map((transaction) => ({
      transactionId: transaction._id,
      billingDate: transaction.bill.billingPeriod,
      receiptNo: transaction.receiptNo,
      paymentAmount: transaction.paymentAmount,
      paymentDate: transaction.paymentDate,
    }));

    return res.status(200).json({
      status: 'success',
      result: result,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};

export const billPayment = async (req, res) => {
  try {
    const { paymentAmount, receiptNo, note, paymentDate } = req.body;

    const paramsBill = req.params.billId;

    console.log(paramsBill);

    if (!mongoose.Types.ObjectId.isValid(paramsBill)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid bill ID',
      });
    }

    const response = await Payment.create({
      bill: paramsBill,
      paymentAmount: paymentAmount,
      receiptNo: receiptNo,
      note: note,
      paymentDate: paymentDate,
    });

    return res.status(200).json({
      status: 'success',
      message: 'Payment has been created!',
      result: response,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};

export const addNewBill = async (req, res) => {
  try {
    const tenantId = req.params.userId;

    if (!tenantId) {
      return res.status(400).json({
        status: 'fail',
        message: 'Missing userID',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(tenantId)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid userID format',
      });
    }

    const {
      meterNumber,
      currentReading,
      previousReading,
      billingPeriod,
      amountPerConsumption,
    } = req.body;

    const createdBill = await Month.create({
      meterNumber,
      currentReading,
      previousReading,
      billingPeriod,
      amountPerConsumption,
      user: tenantId,
    });

    return res.status(200).json({
      status: 'success',
      message: 'New bill created!',
      result: createdBill,
    });
  } catch (error) {
    console.error('Error during payment creation:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};

export const deleteBill = async (req, res) => {
  try {
    const billId = req.params.billId;

    if (!mongoose.Types.ObjectId.isValid(billId)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid bill ID',
      });
    }

    const bill = await Month.findById(billId);

    if (!bill) {
      return res.status(400).json({
        status: 'fail',
        message: 'No bill found in this ID',
      });
    }

    await Payment.deleteMany({ bill: billId });
    await Month.findByIdAndDelete(billId);

    return res.status(204).json({
      status: 'success',
      message: 'Bill and associated payments have been deleted successfully!',
    });
  } catch (error) {
    console.error('Error during deleting bill and its transactions:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};
