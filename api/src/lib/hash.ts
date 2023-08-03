import bcrypt from 'bcrypt';

export async function make(value: string) {
  return await bcrypt.hash(value, 8);
}

export async function check(hash: string, value: string) {
  return await bcrypt.compare(value, hash);
}
