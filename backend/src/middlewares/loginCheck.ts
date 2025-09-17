import { NextFunction, Request, Response } from "express";
import jsonwebtoken from 'jsonwebtoken'
import { JwtPayload } from "../types/types";

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}


export const loginCheck = async (req: AuthenticatedRequest , res: Response, next:NextFunction) => {
  
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
  

   try {
    
    const decoded = jsonwebtoken.verify(token, secret);

    req.user = decoded as JwtPayload;
    next();

   } catch (error) {
     return res.status(401).json({ success: false, msg: 'Unauthorized: Invalid token.' });
   }

};