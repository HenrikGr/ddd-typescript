/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { createClientLogger } from '@hgc-sdk/logger'
import { UserMiddleware } from './UserMiddleware'
import { oAuthService } from '../../../service/authorization'


export const middleware = new UserMiddleware(createClientLogger('UserMiddleware'), oAuthService)
