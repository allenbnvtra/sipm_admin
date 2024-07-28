import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userModel = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
    },
    stallNumber: {
      type: String,
      required: [true, 'Stall number is required'],
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
      select: false,
    },
    passwordChangedAt: Date,
    passwordResetToken: Date,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
    },
    loginAttempts: { type: Number, default: 0, select: false },
    lockUntil: { type: Date, select: false },
  },
  {
    timestamps: true,
  }
);

userModel.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() * 1000;
  next();
});

userModel.pre('save', async function (next) {
  try {
    // Only run this function if password is modified..
    if (!this.isModified('password')) return next();

    // Hash the password with coast of 12
    let salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw error;
  }
});

userModel.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userModel.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.models.User || mongoose.model('User', userModel);

export default User;
