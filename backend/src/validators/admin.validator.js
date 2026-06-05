const { body } = require('express-validator');
const validateResults = require('./validationHelper');

const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,16}$/;

const validateCreateUser = [
  body('name')
    .trim()
    .isLength({ min: 20, max: 60 })
    .withMessage('Name must be between 20 and 60 characters long'),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('A valid email address is required')
    .normalizeEmail(),
  
  body('address')
    .trim()
    .notEmpty()
    .withMessage('Address is required')
    .isLength({ max: 400 })
    .withMessage('Address cannot exceed 400 characters'),
  
  body('password')
    .isLength({ min: 8, max: 16 })
    .withMessage('Password must be between 8 and 16 characters long')
    .matches(passwordRegex)
    .withMessage('Password must contain at least 1 uppercase letter and at least 1 special character'),

  body('role')
    .isIn(['ADMIN', 'USER', 'STORE_OWNER'])
    .withMessage('Role must be ADMIN, USER, or STORE_OWNER'),

  validateResults
];

const validateCreateStore = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Store name is required')
    .isLength({ max: 255 })
    .withMessage('Store name cannot exceed 255 characters'),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('A valid store email address is required')
    .normalizeEmail(),
  
  body('address')
    .trim()
    .notEmpty()
    .withMessage('Store address is required')
    .isLength({ max: 400 })
    .withMessage('Address cannot exceed 400 characters'),
  
  body('ownerId')
    .isInt()
    .withMessage('Owner ID must be an integer'),

  validateResults
];

module.exports = {
  validateCreateUser,
  validateCreateStore
};
