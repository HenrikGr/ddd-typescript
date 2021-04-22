/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { ServiceLogger } from '@hgc-sdk/logger'
import { IUserDao } from '../../infra/database/userDao'
import { IUserRepo } from '../userRepo'
import { UserMap } from '../../mappers/userMap'
import { User } from '../../domain/User'

/**
 * User repository implementation for the user module
 */
export class MongoUserRepo implements IUserRepo {
  private userDao: IUserDao
  private logger: ServiceLogger

  public constructor(userDao: IUserDao, logger: ServiceLogger) {
    this.userDao = userDao
    this.logger = logger
  }

  public async exists(username: string, email?: string): Promise<User | boolean> {
    const foundUser = await this.userDao.exist(username, email)
    if (foundUser) {
      this.logger.verbose('exist: found user ', JSON.stringify(foundUser))
      return UserMap.toDomain(foundUser)
    }

    return false
  }

  public async save(user: User): Promise<boolean> {
    const createUserDTO = UserMap.toCreateUserDTO(user)
    const isUserCreated = await this.userDao.createUser(createUserDTO)
    return isUserCreated
  }

  public async markUserForDeletion(user: User): Promise<boolean> {
    const updateUserDTO = UserMap.toUpdateUserDTO(user)
    const isUpdated = await this.userDao.updateUserByUserName(user.username.value, updateUserDTO)
    return isUpdated
  }

  public async delete(user: User): Promise<boolean> {
    const isDeleted = await this.userDao.deleteUserByUserName(user.username.value)
    return isDeleted
  }
}
