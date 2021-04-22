import { Session } from 'express-session'

declare module 'express-session' {
  interface Session {
    [key: string]: any;
    cookie: Cookie;
  }
}
