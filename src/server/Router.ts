import express, { Router, Request, Response } from 'express';
import { protectRoute } from './middlewares';

export default class AppRouter {
  private expressRouter: Router;

  constructor() {
    this.expressRouter = express.Router();

    this.registerRoutes();
  }

  private registerRoutes(): void {
    // root
    this.expressRouter.get('/', (req: Request, res: Response) => {
      res.json({ msg: 'Hello World' });
    });

    // login
    this.expressRouter.get('/login', (req: Request, res: Response) => {
      const { isAuthenticated } = req.session;

      if (!isAuthenticated) {
        req.session.isAuthenticated = true;
        res.json({ msg: 'Successfully authenticated' });
      } else {
        res.json({ msg: 'Already authenticated' });
      }
    });

    // logout
    this.expressRouter.get('/logout', protectRoute, (req: Request, res: Response) => {
      req.session.destroy(() => {
        res.json({ msg: 'Successfully logged out' });
      });
    });

    // check authentication
    this.expressRouter.get('/check-session', protectRoute, (req: Request, res: Response) => {
      const { name = 'Guest' } = req.query;

      res.json({ msg: `Hello ${name}` });
    });
  }

  public getRouter(): Router {
    return this.expressRouter;
  }
}
