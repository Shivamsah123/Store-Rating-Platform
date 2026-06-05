const jwt = require('jsonwebtoken');
const { UnauthorizedError, ForbiddenError } = require('../utils/customErrors');
const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_store_rating_jwt_key';

const authenticateJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Access token is missing or invalid');
    }

    const token = authHeader.split(' ')[1];
    
    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
      if (err) {
        return next(new UnauthorizedError('Token is expired or invalid'));
      }

      // Verify user still exists in DB
      const user = await User.findByPk(decoded.id);
      if (!user) {
        return next(new UnauthorizedError('The user belonging to this token no longer exists'));
      }
      if (!user.isActive) {
        return next(new UnauthorizedError('Your account has been deactivated'));
      }

      // Attach user details to request object
      req.user = user;
      next();
    });
  } catch (error) {
    next(error);
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new UnauthorizedError('User authentication required'));
    }

    if (roles.length > 0 && !roles.includes(req.user.role)) {
      return next(new ForbiddenError('You do not have permission to perform this action'));
    }

    next();
  };
};

module.exports = {
  authenticateJWT,
  authorize
};
