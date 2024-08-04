import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
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
    passwordResetToken: String, // Change to String if you are using tokens
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

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  try {
    // Hash the password with a cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    // Set passwordChangedAt to current date
    this.passwordChangedAt = Date.now();
  } catch (error) {
    return next(error);
  }
});

// Filter out inactive users
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

// Compare passwords
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
