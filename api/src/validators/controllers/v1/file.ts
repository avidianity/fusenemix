import * as yup from 'yup';

export const downloadSchema = yup.object({
  fileName: yup.string().required(),
});
