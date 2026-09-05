import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export type UserRole = 'learner' | 'teacher' | 'both' | 'admin';
export interface AuthRequest extends Request {
  auth?: { userId: string; role: UserRole };
}

type TokenPayload = { sub: string; role: UserRole };

export function authenticate(request: AuthRequest, response: Response, next: NextFunction) {
  const header = request.header('authorization');
  const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined;
  if (!token) {
    response.status(401).json({ error: 'Authentication required' });
    return;
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as TokenPayload;
    request.auth = { userId: payload.sub, role: payload.role };
    next();
  } catch {
    response.status(401).json({ error: 'Invalid or expired token' });
  }
}

export function requireRoles(...roles: UserRole[]) {
  return (request: AuthRequest, response: Response, next: NextFunction) => {
    if (!request.auth || !roles.includes(request.auth.role)) {
      response.status(403).json({ error: 'You do not have permission for this action' });
      return;
    }
    next();
  };
}
