/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { SignInUser } from './SignInUser'
import { SignInUserController } from './SignInUserController'
import { userRepo } from '../../repos'
import { authorizationService } from '../../service/authorization'

const signInUserController = new SignInUserController(new SignInUser(userRepo, authorizationService))

export { signInUserController }
