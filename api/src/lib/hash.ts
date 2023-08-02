export function make(value: string) {
  return Bun.password.hash(value, { algorithm: 'bcrypt' });
}

export function check(hash: string, value: string) {
  return Bun.password.verify(value, hash, 'bcrypt');
}
