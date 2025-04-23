// src/middleware/auth.ts
import { Request } from "express";
import jwt from "jsonwebtoken";

export interface IUserPayload {
  id: string;
  email: string;
  role: 'USER' | 'PROVIDER' | 'ADMIN'; // استخدام Enum-like values
  iat?: number; // توقيت الإصدار (مضاف تلقائيًا في JWT)
  exp?: number; // توقيت الانتهاء
}

export const authenticate = (req: Request): IUserPayload | null => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    console.log('No authorization header found');
    return null;
  }

  const [bearer, token] = authHeader.split(' ');
  
  if (bearer.toLowerCase() !== 'bearer' || !token) {
    console.error('Invalid authorization format');
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as IUserPayload;
    
    if (!decoded.id || !decoded.email || !decoded.role) {
      throw new Error('Invalid token structure');
    }
    
    return {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };
    
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      console.error('Token expired:', err.expiredAt);
    } else if (err instanceof jwt.JsonWebTokenError) {
      console.error('Invalid token:', err.message);
    } else {
      console.error('Authentication error:', err);
    }
    return null;
  }
};