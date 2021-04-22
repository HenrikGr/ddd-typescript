/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { createClientLogger } from '@hgc-sdk/logger'
import { SignInUser } from './SignInUser'
import { SignInUserController } from './SignInUserController'
import { userRepo } from '../../repos'
import { oAuthService } from '../../service/authorization'

const logger = createClientLogger('SingInUserController')
const useCaseLogger = createClientLogger('SingInUseCase')
const signInUserController = new SignInUserController(new SignInUser(userRepo, oAuthService, useCaseLogger), logger)

export { signInUserController }
