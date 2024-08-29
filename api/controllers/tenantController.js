import mongoose from 'mongoose';
import Month from '../models/monthlyModel.js';
import User from '../models/userModel.js';

export const getAllTenants = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const sort = req.query.sort || ''; // Get the sort parameter
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

    // Construct the sort object
    let sortObject = {};
    if (sort) {
      const sortFields = sort.split(',').map((field) => field.trim());
      sortFields.forEach((field) => {
        const order = field.startsWith('-') ? -1 : 1;
        const fieldName = field.startsWith('-') ? field.substring(1) : field;
        sortObject[fieldName] = order;
      });
    }

    const totalUsersCount = await User.countDocuments(searchQuery);
    const users = await User.find(searchQuery)
      .skip(skip)
      .limit(limit)
      .sort(sortObject);

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
        remainingBalance: remainingBalance.length
          ? parseFloat(remainingBalance[0].totalRemainingBalance.toFixed(2))
          : 0,
      };
    });

    let userData = await Promise.all(userDataPromises);

    // Sort userData based on remainingBalance if the sort field is remainingBalance
    if (sortObject.remainingBalance) {
      userData.sort(
        (a, b) =>
          sortObject.remainingBalance *
          (b.remainingBalance - a.remainingBalance)
      );
    }

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

export const getTenant = async (req, res) => {
  try {
    const tenantId = req.params.tenantId;

    if (!mongoose.Types.ObjectId.isValid(tenantId)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid user ID',
      });
    }

    const result = await User.findOne({ _id: tenantId, role: 'user' });

    if (!result) {
      return res.status(400).json({
        status: 'fail',
        message: 'No user found with this ID',
      });
    }

    return res.status(200).json({
      status: 'success',
      result: {
        id: result._id,
        name: result.name,
        email: result.email,
        stallNumber: result.stallNumber,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};

export const getTenantBill = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const { year } = req.query;

    if (!mongoose.Types.ObjectId.isValid(tenantId)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid tenant ID',
      });
    }

    const bills = await Month.find({ user: tenantId })
      .select('billingPeriod status meterNumber totalPaid remainingBalance')
      .lean();

    const filteredBills = bills.filter((bill) => {
      const billingYear = new Date(bill.billingPeriod).getFullYear();
      return billingYear.toString() === year;
    });

    const result = filteredBills.map((bill) => ({
      id: bill._id,
      billingPeriod: bill.billingPeriod,
      status: bill.status,
      meterNumber: bill.meterNumber,
      amountPaid: bill.totalPaid,
      remainingBalance: bill.remainingBalance,
    }));

    const totalBills = filteredBills.length;

    return res.status(200).json({
      status: 'success',
      result,
      totalBills,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};
