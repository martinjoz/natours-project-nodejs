const mongoose = required('mongoose');
const validator = required('validator');

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
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
