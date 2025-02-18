import express, { Express, Request, Response, Router } from 'express';
import session from 'express-session';
import rateLimit from 'express-rate-limit';
import winston from 'winston';
import expressWinston from 'express-winston';
import responseTime from 'response-time';
import cors from 'cors';
import helmet from 'helmet';
import { createProxyMiddleware } from 'http-proxy-middleware';
import AppRouter from './Router';

export default class Server {
  private app: Express;
  private port = 0;

  private sessionSecret = '';
  private store = new session.MemoryStore();

  private router: AppRouter;

  constructor() {
    this.app = express();
    this.port = +process.env.PORT!;

    this.sessionSecret = process.env.SESSION_SECRET!;

    this.router = new AppRouter();

    this.registerMiddlewares();
    this.registerRoutes();
    this.registerProxyRoutes();
  }

  private registerRoutes(): void {
    this.app.use('', this.router.getRouter());
  }

  private registerMiddlewares(): void {
    this.app.use(
      session({
        secret: this.sessionSecret,
        resave: false,
        saveUninitialized: true,
        store: this.store,
      })
    );

    this.app.use(
        rateLimit({
        windowMs: 5 * 60 * 1000,
        limit: 5,
        message: { msg: 'Too many requests, please try again later.' }
      })
    );

    this.app.use(
      responseTime()
    );

    this.app.use(
      expressWinston.logger({
        transports: [new winston.transports.Console()],
        format: winston.format.json(),
        statusLevels: true,
        meta: false,
        msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
        expressFormat: true,
        ignoreRoute() {
          return false;
        },
      })
    );

    this.app.use(
      cors()
    );

    this.app.use(
      helmet()
    );
  }

  private registerProxyRoutes(): void {
    this.app.use(
      '/pokemon',
      createProxyMiddleware({
        target: 'https://pokeapi.co/api/v2/pokemon/',
        changeOrigin: true,
      })
    );

    this.app.use(
      '/rick-and-morty',
      createProxyMiddleware({
        target: 'https://rickandmortyapi.com/api/character/',
        changeOrigin: true,
      })
    );
  }

  public run(): void {
    this.app.listen(this.port, () => {
      console.log(`Running on port: ${this.port}`);
    });
  }
}
