import { NextFunction, Request, Response } from 'express';

export function errorMiddleware(error: unknown, _request: Request, response: Response, _next: NextFunction) {
  console.error(error);
  const message = error instanceof Error ? error.message : 'Internal server error';
  const statusCode = typeof error === 'object' && error !== null && 'statusCode' in error
    && typeof error.statusCode === 'number' ? error.statusCode : 500;
  const resolvedStatus = message === 'DATABASE_URL is not configured' ? 503 : statusCode;
  const resolvedMessage = message === 'DATABASE_URL is not configured'
    ? 'Database is not configured. Add DATABASE_URL to backend/.env before using this API.'
    : message;
  response.status(resolvedStatus).json({ error: resolvedMessage });
}
