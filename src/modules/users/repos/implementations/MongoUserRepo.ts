/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { ServiceLogger } from '@hgc-sdk/logger'
import { IUserDao } from '../../infra/database/UserDao'

import { IUserRepo } from '../userRepo'
import { UserMap } from '../../mappers/userMap'
import { User } from '../../domain/User'

export class MongoUserRepo implements IUserRepo {
  private dao: IUserDao
  private logger: ServiceLogger

  public constructor(dao: IUserDao, logger: ServiceLogger) {
    this.dao = dao
    this.logger = logger
  }

  public async exists(username: string, email?: string): Promise<User | boolean> {
    this.logger.info('exist: ', username, email)

    const foundUser = await this.dao.exist(username, email)
    if (foundUser) {
      this.logger.verbose('exist: found user ', JSON.stringify(foundUser))
      return UserMap.toDomain(foundUser)
    }

    this.logger.verbose('exist: no user found')
    return false
  }

  public async save(user: User): Promise<boolean> {
    this.logger.info('save: ', JSON.stringify(user))

    const createUserDTO = UserMap.toCreateUserDTO(user)
    const isUserCreated = await this.dao.createUser(createUserDTO)

    this.logger.verbose('save: user created? ', isUserCreated)
    return isUserCreated
  }

  public async markUserForDeletion(user: User) {
    this.logger.info('markUserForDeletion: ', user.username.value)

    const updateUserDTO = UserMap.toUpdateUserDTO(user)
    const isUpdated = await this.dao.updateUserByUserName(user.username.value, updateUserDTO)

    this.logger.verbose('markUserForDeletion: user updated? ', isUpdated)
    return isUpdated
  }

  public async delete(user: User): Promise<boolean> {
    this.logger.info('delete: ', user.username.value)
    const isDeleted  = await this.dao.deleteUserByUserName(user.username.value)
    this.logger.verbose('delete: user deleted? ', isDeleted)
    return isDeleted
  }
}
