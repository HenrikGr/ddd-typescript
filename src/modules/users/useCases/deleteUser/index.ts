/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { createClientLogger } from '@hgc-sdk/logger'
import { DeleteUser } from './DeleteUser'
import { DeleteUserController } from './DeleteUserController'
import { userRepo } from '../../repos'

export const deleteUserController = new DeleteUserController(
  new DeleteUser(userRepo, createClientLogger('DeleteUser')),
  createClientLogger('DeleteUserController')
)
