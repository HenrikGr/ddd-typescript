/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { BaseDao } from '@hgc-sdk/mongo-db'
import { createClientLogger } from '@hgc-sdk/logger'
import { UserModel } from '../infra/database/models/UserModel'
import { MongoUserRepo } from './implementations/MongoUserRepo'
import { dbClient } from '../../../infra/database'

const dao = new BaseDao('UserDb', dbClient)
const logger = createClientLogger('UserModel')

const userModel = new UserModel(dao, logger)
const userRepo = new MongoUserRepo(userModel)

export { userRepo }
