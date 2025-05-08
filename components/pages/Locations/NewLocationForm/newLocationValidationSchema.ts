import * as yup from 'yup';

export const newLocationValidationSchema = yup.object({
  location: yup.string().required('Location field is required.'),
  longitude: yup.number().required('Longitude field is required.'),
  latitude: yup.number().required('Latitude field is required.'),
});
