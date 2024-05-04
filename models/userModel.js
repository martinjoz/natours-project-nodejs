const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please Enter your name'],
  },
  email: {
    type: String,
    required: [true, 'Please Enter your Email'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function (value) {
        return validator.isEmail(value);
      },
      message: '{VALUE} is not a valid email format.',
    },
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please Enter your Password'],
    minLength: [4, 'Password should have atleast four character'],
    select: false, // so that the passowrd s never returned in any response
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    select: false, // so that the passowrd s never returned in any response
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: 'Passwords entered should match.',
    },
  },
  passwordChangedAt: Date,
});

userSchema.pre('save', async function (next) {
  //check if the password field is modified
  if (!this.isModified('password')) return next();

  //Hash the password
  this.password = await bcrypt.hash(this.password, 12);

  //Delete password confirm
  this.passwordConfirm = undefined;

  next();
});

//Method to check if password is correct. This will be available in all the user documents
userSchema.methods.isPasswordValid = async function (
  testPassword,
  originalPassword,
) {
  return await bcrypt.compare(testPassword, originalPassword);
};

//Method to check if the user changed their password so that it can help issue new token or log them out
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
