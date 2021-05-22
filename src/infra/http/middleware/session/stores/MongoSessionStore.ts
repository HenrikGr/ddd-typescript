/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { strict as assert } from 'assert'
import { IAppConfiguration } from '../../../config'
import MongoStore from 'connect-mongo'
import { connectionOpts } from '../../../../database'

assert(process.env.SESSION_DURATION, 'process.env.SESSION_DURATION missing')

/**
 * MongoStore session duration
 */
const sessionDuration = parseInt(process.env.SESSION_DURATION) / 1000

/**
 * Load session store
 * @param appConfig
 */
export function loadSessionStore(appConfig: IAppConfiguration) {
  return {
    sessionStore: MongoStore.create({
      mongoUrl: connectionOpts.connectionURI,
      mongoOptions: connectionOpts.options,
      dbName: 'UserDb',
      ttl: sessionDuration,
      autoRemove: appConfig.environment === 'production' ? 'disabled' : 'native',
    }),
  }
}
