import mongoose from 'mongoose';
import Month from '../models/monthlyModel.js';
import User from '../models/userModel.js';

export const getAllTenants = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
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
    const { page = 1, limit = 10 } = req.query;

    if (!mongoose.Types.ObjectId.isValid(tenantId)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid tenant ID',
      });
    }

    const skip = (page - 1) * limit;

    const bills = await Month.find({ user: tenantId })
      .skip(skip)
      .limit(Number(limit));

    const totalBills = await Month.countDocuments({ user: tenantId });
    const totalPages = Math.ceil(totalBills / limit);

    return res.status(200).json({
      status: 'success',
      totalPages,
      currentPage: Number(page),
      result: bills,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};
