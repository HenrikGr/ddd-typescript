/**
 * @prettier
 * @copyright (c) 2019 - present, HGC-AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */
import { strict as assert } from 'assert'

/**
 * Application configuration interface
 */
export interface AppConfiguration {
  appName: string
  version: string
  port: number | string
  environment: string
}

assert(process.env.APP_NAME, 'process.env.APP_NAME missing')
assert(process.env.APP_VERSION, 'process.env.APP_VERSION missing')
assert(process.env.PORT, 'process.env.PORT missing')
assert(process.env.NODE_ENV, 'process.env.NODE_ENV missing')

/**
 * Application configuration
 */
export const appConfig: AppConfiguration = {
  appName: process.env.APP_NAME,
  version: process.env.APP_VERSION,
  port: parseInt(process.env.PORT),
  environment: process.env.NODE_ENV,
}
