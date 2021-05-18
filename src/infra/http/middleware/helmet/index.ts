/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { Express } from 'express'
import helmet from 'helmet'

/**
 * Apply helmet service for express app
 * @param app
 */
export function applyHelmet(app: Express) {
  app.use(helmet())
}

