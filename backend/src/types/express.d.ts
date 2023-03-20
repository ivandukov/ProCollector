import {User} from "../entities";
import 'express-session';

declare global {
  namespace Express {
    interface Request {
      user: User | null;
    }
  }
}
declare module "express-session" {
  interface session {
    user: User | null;
  }
}
declare module "express-session" {
  interface SessionData {
    user: User | null;
  }
}