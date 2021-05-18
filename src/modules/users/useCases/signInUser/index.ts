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

const jwt = new JWT(JWTConfigurationReader.readEnvironment())
const logger = createClientLogger('SingInUserController')
const useCaseLogger = createClientLogger('SingInUseCase')

export const signInUserController = new SignInUserController(new SignInUser(userRepo, useCaseLogger), logger, jwt)
