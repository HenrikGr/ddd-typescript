/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { createClientLogger } from '@hgc-sdk/logger'
import { AuthorizationService } from './oauth2/AuthorizationService'
import { resourceOwnerClient } from './oauth2/clients/ResourceOwnerClient'

export const oAuthService = new AuthorizationService(resourceOwnerClient, createClientLogger('OAuthService'))
