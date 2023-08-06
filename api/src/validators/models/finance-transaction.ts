import * as yup from 'yup';

export const financeTransactionSchema = yup.object({
  date: yup.date().required(),
  amount: yup.number().required(),
  category: yup.string().required(),
  subCategory: yup.string().nullable(),
  paymentMethod: yup.string().required(),
  recipient: yup.string().required(),
  type: yup.string().required(),
});
