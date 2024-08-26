import Month from '../models/monthlyModel.js';

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
