import * as yup from 'yup';

export const newLocationValidationSchema = yup.object({
  location: yup
    .array()
    .of(yup.string().required('Location is required'))
    .required('Location field is required.'),
  longitude: yup.number().required('Longitude field is required.'),
  latitude: yup.number().required('Latitude field is required.'),
});
