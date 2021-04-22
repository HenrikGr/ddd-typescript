/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { Express } from 'express'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import { connectionOpts } from '../../../database/mongo/DbClient'

declare module 'express-session' {
  interface Session {
    [key: string]: any
    cookie: Cookie
  }
}


export function applySession(app: Express) {
  app.use(
    session({
      resave: false,
      saveUninitialized: false,
      secret: 'secret',
      cookie: {
        httpOnly: true,
        secure: true,
        sameSite: true, // cors
        maxAge: 60 * 60 * 1000, // Time is in milliseconds
      },
      store: MongoStore.create({
        mongoUrl: connectionOpts.connectionURI,
        mongoOptions: connectionOpts.options,
        dbName: 'UserDb',
      }),
    })
  )

}
