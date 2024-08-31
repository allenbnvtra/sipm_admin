import moment from 'moment';
import Month from '../models/monthlyModel.js';
import User from '../models/userModel.js';
import Payment from '../models/paymentModel.js';

export const getUserData = async (req, res) => {
  try {
    const users = await User.find({
      active: { $ne: false },
      role: { $ne: 'admin' },
    });

    const startOfPreviousMonth = moment()
      .subtract(1, 'month')
      .startOf('month')
      .toDate();
    const endOfPreviousMonth = moment()
      .subtract(1, 'month')
      .endOf('month')
      .toDate();

    const unpaidBillsCount = await Month.aggregate([
      {
        $match: {
          status: 'unpaid',
          billingPeriod: {
            $gte: startOfPreviousMonth,
            $lte: endOfPreviousMonth,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalRemainingBalance: { $sum: '$remainingBalance' },
        },
      },
    ]);

    const tenantsWithRemainingBalanceCount = await Month.aggregate([
      {
        $match: {
          remainingBalance: { $gt: 0 },
          billingPeriod: {
            $gte: startOfPreviousMonth,
            $lte: endOfPreviousMonth,
          },
        },
      },
      {
        $group: {
          _id: '$user',
        },
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
        },
      },
    ]);

    return res.status(200).json({
      status: 'success',
      result: {
        userCount: users.length,
        totalTenantsWithRemainingBalance:
          tenantsWithRemainingBalanceCount.length
            ? tenantsWithRemainingBalanceCount[0].count
            : 0,
        unpaidBills: unpaidBillsCount.length
          ? unpaidBillsCount[0].totalRemainingBalance
          : 0,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};

export const getTenantData = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const searchTerms = search.split(',').map((term) => term.trim());

    const searchQuery = {
      active: { $ne: false },
      role: { $ne: 'admin' },
      $or: searchTerms.map((term) => ({
        $or: [
          { name: { $regex: term, $options: 'i' } },
          { email: { $regex: term, $options: 'i' } },
          { stallNumber: { $regex: term, $options: 'i' } },
        ],
      })),
    };

    const totalUsersCount = await User.countDocuments(searchQuery);
    const users = await User.find(searchQuery).skip(skip).limit(limit);

    const userDataPromises = users.map(async (user) => {
      const remainingBalance = await Month.aggregate([
        { $match: { user: user._id, status: 'unpaid' } },
        {
          $group: {
            _id: null,
            totalRemainingBalance: { $sum: '$remainingBalance' },
          },
        },
      ]);

      return {
        id: user._id,
        name: user.name,
        stallNumber: user.stallNumber,
        username: user.email,
        balance: remainingBalance.length
          ? parseFloat(remainingBalance[0].totalRemainingBalance.toFixed(2))
          : 0,
      };
    });

    const userData = await Promise.all(userDataPromises);

    return res.status(200).json({
      status: 'success',
      totalUsersCount,
      page,
      totalPages: Math.ceil(totalUsersCount / limit),
      result: userData,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};

export const getRecentTransactions = async (req, res) => {
  try {
    const transactions = await Payment.find().sort({ createdAt: -1 }).limit(5);

    const formattedTransactions = transactions.map((transaction) => ({
      username: transaction.bill.user.email,
      receiptNo: transaction.receiptNo,
      paymentDate: transaction.paymentDate,
    }));

    return res.status(200).json({
      status: 'success',
      result: formattedTransactions,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};

export const getMonthlyBill = async (req, res) => {
  try {
    const billingMonthStart = moment()
      .subtract(1, 'month')
      .startOf('month')
      .toDate();
    const billingMonthEnd = moment()
      .subtract(1, 'month')
      .endOf('month')
      .toDate();
    const billingMonth = moment().subtract(1, 'month').format('MMMM YYYY');

    const bills = await Month.find({
      billingPeriod: {
        $gte: billingMonthStart,
        $lte: billingMonthEnd,
      },
    });

    const result = bills.reduce(
      (acc, bill) => {
        acc.remainingBalance += bill.remainingBalance;
        acc.totalPaid += bill.totalPaid;
        return acc;
      },
      { remainingBalance: 0, totalPaid: 0, billingMonth }
    );

    return res.status(200).json({
      status: 'success',
      result,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};
