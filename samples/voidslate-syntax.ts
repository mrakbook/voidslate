import express from 'express';
import { json } from 'express';
import { router } from './api/router';
import { env } from './lib/env';

export function createServer(app: express.Express) {
  app.use(json());
  app.use('/api', router);

  app.get('/', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'voidslate',
      version: env.npm_package_version,
      uptime: process.uptime(),
    });
  });

  return app;
}
