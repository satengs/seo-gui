import * as yup from 'yup';

export const signInValidationSchema = yup.object({
  email: yup
    .string()
    .required('Email address field is required.')
    .email('Please enter a valid email address.'),
  password: yup
    .string()
    .required('Password field is required.')
    .min(6, 'Password should be consist at least 6 symbols.'),
});
