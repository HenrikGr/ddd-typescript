/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { strict as assert } from 'assert'
import { Options } from './MailService'

assert(process.env.MAIL_SERVICE_PORT, 'process.env.MAIL_SERVICE_PORT missing')
assert(process.env.MAIL_SERVICE_HOST, 'process.env.MAIL_SERVICE_HOST missing')
assert(process.env.MAIL_SERVICE_USER, 'process.env.MAIL_SERVICE_USER missing')
assert(process.env.MAIL_SERVICE_PWD, 'process.env.MAIL_SERVICE_PWD missing')
assert(process.env.MAIL_SERVICE_SENDER, 'process.env.MAIL_SERVICE_SENDER missing')

/**
 * Default settings being merged with connection options
 */
export const defaultSettings = {
  from: process.env.MAIL_SERVICE_SENDER
}

/**
 * Connection options
 */
export const outlookConnection: Options = {
  port: Number(process.env.MAIL_SERVICE_PORT),  // port for secure SMTP
  host: process.env.MAIL_SERVICE_HOST,          // hostname
  secure: false,                                // TLS requires secureConnection to be false
  auth: {
    user: process.env.MAIL_SERVICE_USER,
    pass: process.env.MAIL_SERVICE_PWD,
  },
  tls: {
    ciphers: 'SSLv3',
  },
}


