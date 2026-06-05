const { body, param } = require('express-validator');
const validateResults = require('./validationHelper');

const validateSubmitRating = [
  body('storeId')
    .isInt()
    .withMessage('Store ID must be an integer'),

  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5'),

  body('comment')
    .optional({ values: 'null' })
    .trim()
    .isLength({ max: 500 })
    .withMessage('Review comment cannot exceed 500 characters'),

  validateResults
];

const validateUpdateRating = [
  param('storeId')
    .isInt()
    .withMessage('Store ID parameter must be an integer'),

  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5'),

  body('comment')
    .optional({ values: 'null' })
    .trim()
    .isLength({ max: 500 })
    .withMessage('Review comment cannot exceed 500 characters'),

  validateResults
];

module.exports = {
  validateSubmitRating,
  validateUpdateRating
};
