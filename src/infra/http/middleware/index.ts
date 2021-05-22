/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { Express } from 'express'
import { IAppConfiguration } from '../config'
import { applyBodyParser } from './bodyparser'
import { applyCors } from './cors'
import { applyCompression } from './compression'
import { applyHelmet } from './helmet'
import { applySession } from './session'
import { applyLogger } from './logger'

/**
 * Load express app middlewares
 * @param app
 * @param appConfig
 */
export function loadExpressMiddleware(app: Express, appConfig: IAppConfiguration) {
  applyLogger(app)
  //applyHelmet(app)
  applyCors(app)
  applyBodyParser(app)
  //applyCompression(app)
  applySession(app, appConfig)
}
