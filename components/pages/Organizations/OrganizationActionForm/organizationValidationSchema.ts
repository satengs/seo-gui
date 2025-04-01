import * as yup from 'yup';

export const organizationValidationSchema = yup.object({
  name: yup.string().required('Workspace address field is required.'),
});
