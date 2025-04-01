import * as yup from 'yup';

export const userAddValidationSchema = yup.object({
  fullName: yup.string().required('The Full name field is required '),
  email: yup
    .string()
    .required('Email address field is required.')
    .email('Please enter a valid email address.'),
  password: yup
    .string()
    .required('Password field is required.')
    .min(6, 'Password should be consist at least 6 symbols.'),
  role: yup.string().required('Role field is important'),
});
