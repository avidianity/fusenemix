import * as yup from 'yup';

export const mp3Schema = yup.object({
  url: yup.string().url().required(),
});
