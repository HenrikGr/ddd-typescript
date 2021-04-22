/**
 * @prettier
 * @copyright (c) 2019 - present, HGC-AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

/**
 * Application configuration interface
 */
export interface AppConfiguration {
  appName: string
  version: string
  port: number | string
  environment: string
}

/**
 * Application configuration
 */
const appConfig: AppConfiguration = {
  appName: process.env.APP_NAME || 'appName',
  version: process.env.APP_VERSION || 'v1',
  port: process.env.PORT || 5000,
  environment: process.env.NODE_ENV || 'development',
}

export { appConfig }
