import express from 'express';
import cors from 'cors';
import { ZodError } from 'zod';

import { env } from './config/env.js';
import { authRoutes } from './routes/authRoutes.js';
import { matchingRoutes } from './routes/matchingRoutes.js';
import { skillRoutes } from './routes/skillRoutes.js';
import { sessionRoutes } from './routes/sessionRoutes.js';
import { trustRoutes } from './routes/trustRoutes.js';
import { quizRoutes } from './routes/quizRoutes.js';
import { errorMiddleware } from './middleware/errorMiddleware.js';

export const app = express();

app.get('/', (_request, response) => {
  response.status(200).json({
    status: 'ok',
    message: 'LearnX Backend API is running successfully'
  });
});

const allowedOrigins = [
...new Set([
env.FRONTEND_URL,
...env.ALLOWED_ORIGINS
.split(',')
.map((origin) => origin.trim())
.filter(Boolean)
])
];

app.use(
cors({
origin: (origin, callback) => {
/*
* Allow requests without an Origin header.
* This includes browser navigation, health checks,
* Postman, and some server-to-server requests.
*/
if (!origin || allowedOrigins.includes(origin)) {
callback(null, true);
return;
}


  callback(new Error('Origin is not allowed'));
},

credentials: true


})
);

/* =========================================================
MIDDLEWARE
========================================================= */

app.use(
express.json({
limit: '1mb'
})
);

/* =========================================================
ROOT ROUTE
========================================================= */

/*

* This route prevents:
*
* Cannot GET /
*
* when opening the Render backend URL directly.
  */
  app.get('/', (_request, response) => {
  response.status(200).json({
  status: 'ok',
  message: 'LearnX Backend API is running successfully',
  service: 'learnx-api'
  });
  });

/* =========================================================
HEALTH CHECK
========================================================= */

app.get('/api/health', (_request, response) => {
response.status(200).json({
status: 'ok',
service: 'learnx-api',
timestamp: new Date().toISOString()
});
});

/* =========================================================
API ROUTES
========================================================= */

app.use('/api/auth', authRoutes);

app.use('/api/matches', matchingRoutes);

/*

* Alternative matching route.
  */
  app.use('/api/matching', matchingRoutes);

app.use('/api/skills', skillRoutes);

app.use('/api/sessions', sessionRoutes);

app.use('/api/trust', trustRoutes);

app.use('/api/quiz', quizRoutes);

/* =========================================================
ZOD VALIDATION ERROR HANDLER
========================================================= */

app.use(
(
error: unknown,
_request: express.Request,
response: express.Response,
next: express.NextFunction
) => {
if (error instanceof ZodError) {
response.status(400).json({
error: 'Validation failed',
details: error.flatten().fieldErrors
});

  return;
}

next(error);


}
);

/* =========================================================
GENERAL ERROR HANDLER
========================================================= */

app.use(errorMiddleware);

