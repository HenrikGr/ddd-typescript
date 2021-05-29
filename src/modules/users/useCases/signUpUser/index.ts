/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { createClientLogger } from '@hgc-sdk/logger'
import { SignUp } from './SignUp'
import { SignUpController } from './SignUpController'
import { userRepo } from '../../repos'

export const signUpUserController = new SignUpController(
  new SignUp(userRepo, createClientLogger('SignUp')),
  createClientLogger('SignUpController'))
