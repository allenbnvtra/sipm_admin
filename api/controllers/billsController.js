import Month from '../models/monthlyModel.js';

export const getAllBill = async (req, res) => {
  try {
    const bill = await Month.find();

    return res.status(200).json({
      status: 'success',
      result: bill,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};
