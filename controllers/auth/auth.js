const User = require('./../../models/userModel');
const catchAsync = require('./../../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('./../../utils/appError');

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

exports.login = async (req, res, next) => {
  //Get entered email and password using destructuring
  const { email, password } = req.body;

  //Check if they exists in the input fields
  if (!email || !password) {
    return next(new AppError('Please enter all fields.', 400));
  }

  //check if the user exists in the db and if the credentials are correct
  //Get the user email and psw from the db
  const user = await User.findOne({ email }).select('+password'); //Since psw cannot be return using findOne thus use the select and +
  //Use the isPasswordValid from the usermodel to check psw authenticity
  if (!user || !(await user.isPasswordValid(password, user.password))) {
    return next(new AppError('Wrong email or password'));
  }

  //Authorize the user and issue jwt token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  res.status(200).json({
    status: 'success',
    message: 'login successfully',
    token,
  });
};

exports.protect = async (req, res, next) => {
  //this will be used to protected routes

  //Get token in the header
  let token;
  if (req.headers && req.headers.authorization.startswith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new AppError('Please Login to continue', 401));
  }
  //if(req.headers && req)

  next();
};
