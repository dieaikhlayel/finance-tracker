import { createApp } from './app';
import { env } from './config/env';
import { pingDatabase, pool } from './config/db';

async function main() {
  // Fail fast if the DB is unreachable
  try {
    await pingDatabase();
    console.log(`[db] connected to ${env.db.host}:${env.db.port}/${env.db.database}`);
  } catch (err) {
    console.error('[db] connection failed:', err);
    process.exit(1);
  }

  const app = createApp();

  const server = app.listen(env.port, () => {
    console.log(`[server] listening on http://localhost:${env.port}`);
    console.log(`[server] env=${env.nodeEnv}, cors=${env.corsOrigin}`);
  });

  // Graceful shutdown — close the HTTP server, then the DB pool
  const shutdown = async (signal: string) => {
    console.log(`[server] ${signal} received, shutting down`);
    server.close(async () => {
      await pool.end();
      console.log('[server] closed');
      process.exit(0);
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

main().catch((err) => {
  console.error('[fatal]', err);
  process.exit(1);
});