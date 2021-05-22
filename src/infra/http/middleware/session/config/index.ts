/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { strict as assert } from 'assert'
import { IAppConfiguration } from '../../../config'

assert(process.env.SESSION_SECRET, 'process.env.SESSION_SECRET missing')
assert(process.env.SESSION_COOKIE_NAME, 'process.env.SESSION_DURATION missing')

/**
 * Session middleware configuration
 */
const sessionConfig = {
  name: process.env.SESSION_COOKIE_NAME,
  resave: false,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET,
}

/**
 * Cookie configuration
 */
const cookieConfig = {
  httpOnly: true, // Will not allow client-side JavaScript to see the cookie in document.cookie
  secure: false, // Ensures the cookie is sent only over HTTP(S), protect against cross-site scripting attacks.
  sameSite: true, // cors
}

/**
 * Load session settings
 * @param appConfig
 */
export function loadSessionConfig(appConfig: IAppConfiguration) {
  return {
    sessionConfig,
    cookieConfig,
  }
}
