/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { Express } from 'express'
import cors, { CorsOptions, CorsOptionsDelegate } from 'cors'

/**
 * Allowed origins
 */
const allowedOrigins = ['https://example.com', 'https://example2.com']

/**
 * Dynamically set cors options
 * @param req
 * @param callback
 */
const setCorsOptions: CorsOptionsDelegate = (req: any, callback: any) => {
  let corsOptions: CorsOptions = {
    origin: true,
    credentials: true,
    allowedHeaders: ['Accept', 'Content-Type', 'Authorization'],
    exposedHeaders: ['WWW-Authenticate', 'X-Accepted-OAuth-Scopes', 'X-OAuth-Scopes']
  }

  const isOriginAllowed = allowedOrigins.indexOf(req.header('Origin')) !== -1

  // Disable cors only in production and if origin is not valid
  if (process.env.NODE_ENV === 'production' && !isOriginAllowed) {
    corsOptions.origin = false
  }

  callback(null, corsOptions)
}

/**
 * Apply cors for express app
 * @param app
 */
export function applyCors(app: Express) {
  // @ts-ignore
  app.options('*', cors())
  app.use(cors(setCorsOptions))
}
