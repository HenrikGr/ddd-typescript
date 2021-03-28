/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { BaseDao } from '@hgc-sdk/mongo-db'
import { createClientLogger } from '@hgc-sdk/logger'
import { AuthorizationService } from './AuthorizationService'
import { AccessTokenModel } from '../../infra/database/models/AccessTokenModel'
import { dbClient } from '../../../../infra/database'

const dao = new BaseDao('UserDb', dbClient)
const logger = createClientLogger('AccessTokenModel')

const model = new AccessTokenModel(dao, logger)
const authorizationService = new AuthorizationService(model)

export { authorizationService }
