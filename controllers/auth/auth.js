const User = require('./../../models/userModel');
const catchAsync = require('./../../utils/catchAsync');
const jwt = require('jsonwebtoken');

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  //creating a jwt token
  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  res.status(201).json({
    status: 'success',
    message: 'User Created Successfully',
    token,
    user: newUser,
  });
  next();
});
