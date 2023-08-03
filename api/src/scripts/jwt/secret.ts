import { ulid } from 'ulid';

function main() {
  const secret = `${ulid()}-${ulid()}`;

  console.log(secret);
}

main();
