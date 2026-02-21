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

export function generateId(prefix = "INV") {
  const now = new Date();

  const year = String(now.getFullYear()).slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
 

  return `${prefix.toUpperCase()} D${day}${month}${year}T${hours}${minutes}${seconds}`;
  
}

export function cleanName(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")  
    .trim()
    .replace(/\s+/g, " ")          
    .replace(/\b\w/g, c => c.toUpperCase());
}