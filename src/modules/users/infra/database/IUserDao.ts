/**
 * @prettier
 * @copyright (c) 2020 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { CreateUserDTO } from '../../dtos/CreateUserDTO'
import { UpdateUserDTO } from '../../dtos/UpdateUserDTO'

/**
 * Data Access object interface for users
 */
export interface IUserDao {
  list(limit: number, page: number): Promise<any>
  exist(userName: string, email?: string): Promise<any>
  getUserByUserId(id: string): Promise<any>
  getUserByUserName(userName: string): Promise<any>
  getUserByUserEmail(userEmail: string): Promise<any>
  createUser(dto: CreateUserDTO): Promise<any>
  updateUserByUserName(userName: string, dto: UpdateUserDTO): Promise<any>
  deleteUserByUserName(username: string): Promise<any>
}
