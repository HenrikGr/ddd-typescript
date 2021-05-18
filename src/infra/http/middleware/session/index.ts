/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { Express } from 'express'
import { AppConfiguration } from '../../config'
import session, { Cookie } from 'express-session'
import { loadSessionConfig } from './config'
import { loadSessionStore } from './stores/MongoSessionStore'

declare module 'express-session' {
  interface Session {
    [key: string]: any
    cookie: Cookie
  }
}

/**
 * Apply session management to express app
 * @param app
 * @param appConfig
 */
export function applySession(app: Express, appConfig: AppConfiguration) {
  const { sessionConfig, cookieConfig } = loadSessionConfig(appConfig)
  const { sessionStore } = loadSessionStore(appConfig)

  // In production mode - set the secure flag to true to use HTTPS
  if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy
    cookieConfig.secure = true
  }

  app.use(
    session({
      ...sessionConfig,
      cookie: cookieConfig,
      store: sessionStore,
    })
  )
}
