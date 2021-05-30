/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { createClientLogger } from '@hgc-sdk/logger'
import { SignIn } from './SignIn'
import { SignInController } from './SignInController'
import { userRepo } from '../../repos'

export const signInController = new SignInController(
  new SignIn(userRepo, createClientLogger('SingIn')),
  createClientLogger('SingInController')
)
