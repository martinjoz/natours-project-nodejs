class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'Fail' : 'Error'; //just same as status:'fail'
    this.isOperational = true; // To help only print error as a results of operational errors eg no db connection and not programming errors
  }
}
