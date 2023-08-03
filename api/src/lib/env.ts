import path from 'path';
import dotenv from 'dotenv';

export function loadEnv() {
  dotenv.config({
    path: path.resolve(__dirname, '../../.env'),
  });
}
