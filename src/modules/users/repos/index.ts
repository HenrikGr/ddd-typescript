/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { createClientLogger } from '@hgc-sdk/logger'
import { MongoUserRepo } from './implementations/MongoUserRepo'
import { userDao } from '../infra/database'

const logger = createClientLogger('UserRepo')
const userRepo = new MongoUserRepo(userDao, logger)

export { userRepo }
