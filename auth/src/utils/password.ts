import crypto from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(crypto.scrypt);

const hash = async (password: string) => {
  const salt = crypto.randomBytes(8).toString('hex');
  const buf = (await scrypt(password, salt, 64)) as Buffer;
  return `${buf.toString('hex')}.${salt}`;
};

const compare = async (encrypted: string, candidate: string) => {
  const [hashed, salt] = encrypted.split('.');
  const buf = (await scrypt(candidate, salt, 64)) as Buffer;
  return buf.toString('hex') === hashed;
};

export { hash, compare };
