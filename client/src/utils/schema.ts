import * as Yup from 'yup';


const passwordRules = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;
const phoneRegex = /^\+?[1-9]\d{1,14}$/;

export const registrationSchema = Yup.object().shape({
    firstName: Yup.string()
      .required('First name is required')
      .min(2, 'First name must be at least 2 characters')
      .max(50, 'First name cannot exceed 50 characters'),
    
    lastName: Yup.string()
      .required('Last name is required')
      .min(2, 'Last name must be at least 2 characters')
      .max(50, 'Last name cannot exceed 50 characters'),
    
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required')
      .max(100, 'Email cannot exceed 100 characters'),
    
    phone: Yup.string()
      .required('Phone number is required')
      .matches(phoneRegex, 'Invalid phone number format'),
    
    dob: Yup.date()
      .required('Date of birth is required')
      .max(new Date(), "Date of birth cannot be in the future")
      .test('age', 'You must be at least 13 years old', function(value) {
        if (!value) return false;
        const cutoff = new Date();
        cutoff.setFullYear(cutoff.getFullYear() - 13);
        return value <= cutoff;
      }),
    
    password: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters')
      .matches(
        passwordRules,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      ),
    
    confirmPassword: Yup.string()
      .required('Please confirm your password')
      .oneOf([Yup.ref('password')], 'Passwords must match'),
    
    preferences: Yup.array()
      .min(1, 'Please select at least one preference')
      .required('Please select at least one preference')
  });