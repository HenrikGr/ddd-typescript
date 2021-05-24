/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { createClientLogger } from '@hgc-sdk/logger'
import { SignUpUser } from './SignUpUser'
import { SignUpUserController } from './SignUpUserController'
import { userRepo } from '../../repos'

export const signUpUserController = new SignUpUserController(
  new SignUpUser(userRepo, createClientLogger('SignUpUser')),
  createClientLogger('SignUpUserController')
)

