import * as yup from 'yup';

export const envSchema = yup.object({
  ENV: yup
    .string()
    .oneOf(['development', 'production'] as const)
    .required(),
  PORT: yup.number().nullable(),
  SECRET: yup.string().required(),

  DB_HOST: yup.string().required(),
  DB_PORT: yup.number().required(),
  DB_NAME: yup.string().required(),
  DB_USER: yup.string().required(),
  DB_PASS: yup.string().required(),
});

export type Env = yup.InferType<typeof envSchema>;
