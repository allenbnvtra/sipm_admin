import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    bill: {
      type: mongoose.Schema.ObjectId,
      ref: 'Month',
      required: [true, 'A payment should have bill'],
    },
    receiptNo: {
      type: String,
      required: true,
    },
    paymentAmount: {
      type: Number,
      required: true,
    },
    balance: {
      type: Number,
    },
    paymentDate: {
      type: Date,
      required: true,
    },
    note: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

paymentSchema.pre('save', async function (next) {
  try {
    const month = await mongoose.model('Month').findById(this.bill);

    if (month && month.remainingBalance !== undefined) {
      if (
        this.paymentAmount < month.remainingBalance + 1 &&
        month.remainingBalance > 0
      ) {
        month.remainingBalance -= this.paymentAmount;
        month.remainingBalance = Math.max(0, month.remainingBalance);

        this.balance = month.remainingBalance;
        await month.save();

        next();
      } else {
        throw new Error('Remaining balance cannot be less than 0.');
      }
    } else {
      throw new Error(
        'MonthAudit not found or remainingBalance not available.'
      );
    }
  } catch (error) {
    next(error); // Call next with the error to propagate it
  }
});

paymentSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'bill',
    select: 'remainingBalance billingPeriod user',
  });
  next();
});

const Payment =
  mongoose.models.Payment || mongoose.model('Payment', paymentSchema);

export default Payment;
