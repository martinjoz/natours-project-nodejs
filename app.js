const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const app = express();

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

/////////////////////////////////////////////Middleware /////////////////////////
//// 3rd Party middleware
if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev')); //Used to log request in terminal eg Get, Post and url used and time it took
}
app.use(express.json()); //Acts as middleware to help access the req property in POST request
/////////My own middleware
app.use((req, res, next) => {
  console.log('Hello from middleware');
  next();
});

//mounting the router
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//Handle routes not defined using middleware
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `The route ${req.originalUrl} cannot be found.`,
  });
});

////////////////// Start Server
module.exports = app;
