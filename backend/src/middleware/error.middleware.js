const { AppError } = require('../utils/customErrors');

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Handle Sequelize Validation Errors
  if (err.name === 'SequelizeValidationError') {
    const messages = err.errors.map(el => el.message);
    return res.status(400).json({
      status: 'fail',
      message: 'Validation error',
      errors: messages
    });
  }

  // Handle Sequelize Unique Constraint Errors
  if (err.name === 'SequelizeUniqueConstraintError') {
    const messages = err.errors.map(el => el.message);
    return res.status(409).json({
      status: 'fail',
      message: 'Duplicate entry detected',
      errors: messages
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      status: 'fail',
      message: 'Invalid token. Please log in again.'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      status: 'fail',
      message: 'Your token has expired. Please log in again.'
    });
  }

  // Custom Operational errors (AppError)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      ...(err.errors && { errors: err.errors })
    });
  }

  // Log unexpected errors
  console.error('ERROR 💥:', err);

  // General server fallback error
  return res.status(err.statusCode).json({
    status: err.status,
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong on the server',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
