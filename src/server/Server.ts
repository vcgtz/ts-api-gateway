import express, { Express, Request, Response, Router } from 'express';
import session from 'express-session';
import rateLimit from 'express-rate-limit';
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
  }

  private registerRoutes(): void {
    this.app.use('', this.router.getRouter());
  }

  private registerMiddlewares(): void {
    this.app.use(session({
      secret: this.sessionSecret,
      resave: false,
      saveUninitialized: true,
      store: this.store,
    }));

    this.app.use(rateLimit({
      windowMs: 5 * 60 * 1000,
      limit: 5,
      message: { msg: 'Too many requests, please try again later.' }
    }));
  }

  public run(): void {
    this.app.listen(this.port, () => {
      console.log(`Running on port: ${this.port}`);
    });
  }
}
