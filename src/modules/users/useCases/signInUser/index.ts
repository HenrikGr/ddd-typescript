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
import { JWT, JWTConfigurationReader } from '../../service/authentication/jwt'
import { AuthenticationService } from '../../service/authentication/AuthenticationService'


export const signInUserController = new SignInUserController(
  new SignInUser(userRepo, createClientLogger('SingInUseCase')),
  new AuthenticationService(
    new JWT(JWTConfigurationReader.readEnvironment(), createClientLogger('JWT')),
    createClientLogger('AuthenticationService')
  ),
  createClientLogger('SingInUserController')
)
