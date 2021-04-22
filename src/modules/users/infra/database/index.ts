/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { createClientLogger } from '@hgc-sdk/logger'
import { MongoUserDao } from './implementations/MongoUserDao'
import { baseDao } from '../../../../infra/database/mongo/BaseDao'

const logger = createClientLogger('UserDao')
const userDao = new MongoUserDao(baseDao, logger)

export { userDao }
