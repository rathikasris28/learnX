import { app } from './app.js';
import { env } from './config/env.js';
import { initializeDatabase, pool } from './config/database.js';

async function start() {
  try {
    if (env.DATABASE_URL) {
      await initializeDatabase();
      console.info('PostgreSQL schema is ready');
    } else {
      console.warn('DATABASE_URL is not configured; database routes will be unavailable');
    }

    const server = app.listen(env.PORT, () => {
      console.info(`LearnX API listening on http://localhost:${env.PORT}`);
    });

    const shutdown = async () => {
      server.close(async () => {
        await pool?.end();
        process.exit(0);
      });
    };
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    console.error('Failed to start LearnX API', error);
    await pool?.end();
    process.exit(1);
  }
}

void start();
