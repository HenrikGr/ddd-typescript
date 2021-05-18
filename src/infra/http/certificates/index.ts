/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { strict as assert } from 'assert'
import fs from 'fs'

/**
 * Load server certificate and key
 */
export function loadServerCerts() {
  assert(process.env.SERVER_KEY_FILE, 'process.env.SERVER_KEY_FILE missing')
  assert(process.env.SERVER_CERT_FILE, 'process.env.SERVER_CERT_FILE missing')

  const key = fs.readFileSync(process.env.SERVER_KEY_FILE, 'utf-8')
  const cert = fs.readFileSync(process.env.SERVER_CERT_FILE, 'utf-8')

  return { key, cert}
}
