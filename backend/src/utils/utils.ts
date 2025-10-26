import crypto from 'crypto'
import bcrypt from 'bcryptjs'



export const NEW_OTP = ()=> {
  return  crypto.randomInt(100000, 999999).toString()
};

export const createHashedPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
};