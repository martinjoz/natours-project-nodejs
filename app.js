const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const app = express();

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

//Errors
const AppError = require('./utils/appError');
const globalError = require('./controllers/errors/error');

/////////////////////////////////////////////Middleware /////////////////////////
//// 3rd Party middleware
if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev')); //Used to log request in terminal eg Get, Post and url used and time it took
  console.log('DEVELOPMENT MODE');
} else if (process.env.NODE_ENV == 'production') {
  console.log('PRODUCTION MODE');
}

/////////////////////////////////////////////Middleware for Rate Limiting /////////////////////////
// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, //After requests are exhausted then user wait for 1 hour to continue making the requests
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

/////////////////// end rate limiter /////////////////////////

app.use(express.json()); //Acts as middleware to help access the req property in POST request
/////////My own middleware
app.use((req, res, next) => {
  console.log('Hello from middleware');
  next();
});

//mounting the router
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//Handle routes not defined using middleware. Use it after the routes
app.all('*', (req, res, next) => {
  //Initial way before using error handling middleware
  //   res.status(404).json({
  //     status: 'fail',
  //     message: `The route ${req.originalUrl} cannot be found.`,
  //   });

  // final way after using error handling middleware
  //   const err = new Error(`The route ${req.originalUrl} cannot be found.`);
  //   err.status = 'Fail';
  //   err.statusCode = 404;

  //Now after using the utils AppError

  next(new AppError(`The route ${req.originalUrl} cannot be found.`, 404)); //Node will auto know that the error middleware should be called when you specify the err inside the next()
});

/////   Implementing the ERROR Handling Middleware
app.use(globalError);

module.exports = app;
