/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { Express } from 'express'
import compression from 'compression'

/**
 * Apply compression for express app
 * @param app
 */
export function applyCompression(app: Express) {
  app.use(compression())
}

