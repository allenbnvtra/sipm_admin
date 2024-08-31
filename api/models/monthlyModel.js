import mongoose from 'mongoose';

const monthlyAuditSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Monthly bill must belong to a user'],
    },
    meterNumber: {
      type: String,
    },
    currentBill: {
      type: Number,
      default: 0,
    },
    currentReading: {
      type: Number,
      required: [true, 'Current reading is required'],
      default: 0,
    },
    previousReading: {
      type: Number,
      required: [true, 'Previous reading is required'],
      default: 0,
    },
    totalConsumption: {
      type: Number,
      default: 0,
    },
    amountPerConsumption: {
      type: Number,
      default: 0,
      required: [true, 'Amount per consumption is required'],
    },
    remainingBalance: Number,
    totalPaid: Number,
    status: {
      type: String,
      enum: ['paid', 'unpaid'],
      default: 'unpaid',
    },
    billingPeriod: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

monthlyAuditSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name stallNumber email active',
  });
  next();
});

monthlyAuditSchema.pre('save', function (next) {
  this.totalConsumption = this.currentReading - this.previousReading;
  this.currentBill = this.totalConsumption * this.amountPerConsumption;

  if (this.remainingBalance === undefined) {
    this.remainingBalance = this.currentBill;
  }

  this.totalPaid = this.currentBill - this.remainingBalance;

  next();
});

monthlyAuditSchema.pre('save', function (next) {
  if (this.remainingBalance === 0) {
    this.status = 'paid';
  }

  next();
});

const Month =
  mongoose.models.Month || mongoose.model('Month', monthlyAuditSchema);

export default Month;
