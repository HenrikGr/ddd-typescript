/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { createClientLogger } from '@hgc-sdk/logger'
import { UserDao } from './dao/UserDao'
import { SessionDao } from './dao/SessionDao'
import { baseDao } from '../../../../infra/database/mongo/BaseDao'

const logger = createClientLogger('UserDao')
const userDao = new UserDao(baseDao, logger)

const sessionLogger = createClientLogger('SessionDao')
const sessionDao = new SessionDao(baseDao, sessionLogger)

export {
  userDao,
  sessionDao
}
