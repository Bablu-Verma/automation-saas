import jsonwebtoken from 'jsonwebtoken'
import type ms from "ms"; // for typing
import { JwtPayload } from '../types/types';
import { Request, Response } from "express";



interface JwtUser {
  _id: string;
  email: string;
  role: string
}

export const jsonwebtoken_create = (user: JwtUser, time: number | ms.StringValue) => {

  return jsonwebtoken.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET || '',
    { expiresIn: time }
  );

}

export const jsonwebtoken_decoded = async (req: Request, res: Response) => {
  
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
  
    return res.status(401).json({
      success: false,
      msg: 'Authorization token is required.',
    });
  }

  const token = authHeader.split(' ')[1];

   const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('JWT_SECRET is not defined in environment variables.');
      return res.status(500).json({
        success: false,
        msg: 'Server configuration error.',
      });
    }

    const decoded = jsonwebtoken.verify(token, secret) as JwtPayload;

    return decoded
};
