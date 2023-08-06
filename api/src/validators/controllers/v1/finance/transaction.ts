import * as yup from 'yup';

export const indexQuerySchema = yup.object({
  from: yup.date(),
  to: yup.date(),
});
