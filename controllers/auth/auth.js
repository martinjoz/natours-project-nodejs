const { promisify } = require('util');
const catchAsync = require('./../../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('./../../utils/appError');
const User = require('./../../models/userModel');
const sendEmail = require('./../../utils/email');
const crypto = require('crypto');

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
  });

  //creating a jwt token
  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  // Omit password field from user object
  newUser.password = undefined;

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

exports.protect = catchAsync(async (req, res, next) => {
  //this will be used to protected routes

  //Get token in the header
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new AppError('Please Login to continue', 401));
  }
  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401,
      ),
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401),
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser; // This displays users details inc the roles that will be used somewhere else
  next();
});

//Roles
exports.restrictTo = (...roles) => {
  //Use the spread operator to take the incoming roles parameters as arrays. eg from the delete tour roled we have roles as 'admin','lead-guide'
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      // the req.user.role comes from the protect middlware in authjs where b4 we call next() we set the user to req.user=currentUser
      return next(
        new AppError('You do not have permission to perform this action', 403),
      );
    }
    next();
  };
};

exports.forgetPassword = catchAsync(async (req, res, next) => {
  //Get user email and check if it exists
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new AppError('There is no such user with that email address', 404),
    );
  }

  //Generate the random reset token
  const resetToken = user.createPasswordResetToken(); //from the userModel
  await user.save({ validateBeforeSave: false }); //this helps to save things like resetExpires from the prev line

  //Send token to the user
  const resetURL = `${req.protocol}://${req.get(
    'host',
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    console.log(err);
    //Clear the token fields in the db since email was not sent
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500,
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get the user with that token
  //First encrypt the incoming tokenin req.params and compare it with token from the db to get the user
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('The token is invalid or has expired.'));
  }
  //Set the new password  and delete the reset token
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  //Log in the user using JWT
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  res.status(200).json({
    status: 'success',
    message: 'Password changed Successfully',
    token,
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  //Get user from collection
  const user = await User.findById(req.user.id).select('+password');

  //Check if current password is correct
  if (!(await user.isPasswordValid(req.body.currentPassword, user.password))) {
    return next(new AppError('Your Current Password is Wrong', 401));
  }

  //Update Password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save(); //findByIdAndUpdate wont work since validators wont be run

  //Login user and send Jwt
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  res.status(200).json({
    status: 'success',
    message: 'Password Changed successfully',
    token,
  });
});
