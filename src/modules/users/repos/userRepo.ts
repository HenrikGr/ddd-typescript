/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { User } from '../domain/User'

/**
 * User repository interface
 */
export interface IUserRepo {
  exists(username: string, email?: string): Promise<User | boolean>
  save(user: User): Promise<boolean>
  markUserForDeletion(user: User): Promise<boolean>
  delete(user: User): Promise<boolean>
}
