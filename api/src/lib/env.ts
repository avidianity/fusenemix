import path from 'path';
import dotenv from 'dotenv';
import * as os from '@/helpers/os';

export async function loadEnv() {
  const possiblePaths = ['../../.env', '../.env'];

  for (const possiblePath of possiblePaths) {
    try {
      const buffer = await os.readFile(path.resolve(__dirname, possiblePath));

      const parsed = dotenv.parse(buffer);

      for (const [key, value] of Object.entries(parsed)) {
        process.env[key] = value;
      }
      break;
    } catch (_) {
      //
    }
  }
}
