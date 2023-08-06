import * as yup from 'yup';

export const jobEventSchema = yup.object({
  type: yup.string().required(),
  args: yup.array().required(),
});

export type JobEvent = yup.InferType<typeof jobEventSchema>;
