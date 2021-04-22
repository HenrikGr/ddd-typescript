/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { createClientLogger } from '@hgc-sdk/logger'
import { OAuthService } from './OAuthService'
import { oAuthClient } from './client/Client'

const logger = createClientLogger('OAuthService')
const oAuthService = new OAuthService(oAuthClient, logger)

export { oAuthService }
