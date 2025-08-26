import bcrypt from 'bcrypt';

export const hashPassword = async (Password: string) => {
  return await bcrypt.hash(Password, 10);
};

export const comparePassword = async (plain: string, hash: string) => {
  return await bcrypt.compare(plain, hash);
};
