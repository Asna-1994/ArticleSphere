import { body } from 'express-validator';

export const registerValidator = [
  body('firstName')
    .notEmpty().withMessage('First name is required')
    .isString().withMessage('First name must be a string')
    .trim(),
  
  body('lastName')
    .notEmpty().withMessage('Last name is required')
    .isString().withMessage('Last name must be a string')
    .trim(),
  
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('phone')
    .notEmpty().withMessage('Phone number is required')
    .matches(/^[0-9+\-\s]+$/).withMessage('Please provide a valid phone number')
    .trim(),
  
  body('dob')
    .notEmpty().withMessage('Date of birth is required')
    .isISO8601().withMessage('Please provide a valid date in ISO8601 format (YYYY-MM-DD)')
    .toDate(),
  
    body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])/)
    .withMessage('Password must include at least one uppercase letter, one lowercase letter, one number, and one special character'),
  
  
  
  body('preferences')
    .isArray().withMessage('Preferences must be an array')
    .custom((value) => {
      if (!value.every((id: any) => typeof id === 'string')) {
        throw new Error('Each preference must be a string ID');
      }
      return true;
    })
];

export const loginValidator = [
  body('identifier')
    .notEmpty().withMessage('Email or phone is required')
    .trim(),
  
  body('password')
    .notEmpty().withMessage('Password is required')
];

export const changePasswordValidator = [
  body('currentPassword')
    .notEmpty().withMessage('Current password is required'),
  
    body('newPassword')
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])/)
    .withMessage('Password must include at least one uppercase letter, one lowercase letter, one number, and one special character')
  
  
];