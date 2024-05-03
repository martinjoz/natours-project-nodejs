class AppError extends Error {
  constructor(message, statusCode) {
    super(message); //From parent class Error that has this property

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'Fail' : 'Error'; //just same as status:'fail'
    this.isOperational = true; // To help only print error as a results of operational errors eg no db connection and not programming errors

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
