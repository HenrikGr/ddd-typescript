/**
 * @prettier
 * @copyright (c) 2021 - present, HGC-AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

interface UserCredentials {
  password: string
}

export interface CreateUserDTO {
  _id: string
  username: string
  email: string
  credentials: UserCredentials
  scope: string
  isEmailVerified: boolean
  isAdminUser: boolean
  isDeleted: boolean
}
