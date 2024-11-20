import * as bcrypt from 'bcrypt';

const saltRounds = 10;

export function comparePassword(password: string, hash: string) {
  return bcrypt.compareSync(password, hash);
}

export function hashPassword(password: string) {
  return bcrypt.hash(password, saltRounds);
}
