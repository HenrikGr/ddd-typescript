/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { createClientLogger } from '@hgc-sdk/logger'
import { ResourceOwner } from './ResourceOwner'
import { sessionDao } from '../../infra/database'
import { oAuthClient } from './Client'

const logger = createClientLogger('ResourceOwner')

const oAuthService = new ResourceOwner(sessionDao, oAuthClient, logger)

export { oAuthService }
