import * as yup from 'yup';

export const modelIdSchema = yup.object({
  id: yup.string().required(),
});
