import * as yup from 'yup';

export const envSchema = yup.object({
  ENV: yup
    .string()
    .oneOf(['development', 'production', 'testing'] as const)
    .required(),
  PORT: yup.number().nullable(),
  SECRET: yup.string().required(),

  DB_HOST: yup.string().required(),
  DB_PORT: yup.number().required(),
  DB_NAME: yup.string().required(),
  DB_USER: yup.string().required(),
  DB_PASS: yup.string().required(),

  REDIS_HOST: yup.string().required(),
  REDIS_PORT: yup.number().required(),
  REDIS_USER: yup.string(),
  REDIS_PASS: yup.string(),

  CLOUDMERSIVE_KEY: yup.string().required(),
});

export type Env = yup.InferType<typeof envSchema>;
