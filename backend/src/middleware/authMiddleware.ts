import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { env } from '../config/env.js';
export type UserRole = 'learner' | 'teacher' | 'both' | 'admin';
export interface AuthRequest extends Request {
auth?: { userId: string; role: UserRole };
}
const tokenPayloadSchema = z.object({
sub: z.string().uuid(),
role: z.enum(['learner', 'teacher', 'both', 'admin']),
tokenType: z.literal('access')
});
export function authenticate(
request: AuthRequest,
response: Response,
next: NextFunction
) {
const header = request.header('authorization');
const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined;

if (!token) {
response.status(401).json({ error: 'Authentication required' });
return;
}
try {
const verified = jwt.verify(token, env.JWT_SECRET, {
algorithms: ['HS256'],
issuer: env.JWT_ISSUER,
audience: env.JWT_AUDIENCE
});
const parsed = tokenPayloadSchema.safeParse(verified);
if (!parsed.success) {
  response.status(401).json({ error: 'Invalid or expired token' });
  return;
}
request.auth = {
  userId: parsed.data.sub,
  role: parsed.data.role
};
next();
} catch {
response.status(401).json({ error: 'Invalid or expired token' });
}
}
export function requireRoles(...roles: UserRole[]) {
return (
request: AuthRequest,
response: Response,
next: NextFunction
) => {
if (!request.auth || !roles.includes(request.auth.role)) {
response.status(403).json({
error: 'You do not have permission for this action'
});
return;
}
next();
};
}
