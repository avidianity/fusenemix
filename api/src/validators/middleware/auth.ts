import * as yup from 'yup';

export const authSchema = yup.object({
  authorization: yup
    .string()
    .required()
    .matches(/^Bearer .+$/),
});
