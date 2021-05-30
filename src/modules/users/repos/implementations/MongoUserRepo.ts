/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { ServiceLogger } from '@hgc-sdk/logger'
import { IUserDao } from '../../infra/database/IUserDao'
import { IUserRepo } from '../userRepo'
import { UserMap } from '../../mappers/userMap'
import { User } from '../../domain/User'

/**
 * User repository implementation for the user module
 *
 * @implements IUserRepo
 * @class MongoUserRepo
 */
export class MongoUserRepo implements IUserRepo {

  /**
   * Data Access Object to the mongo database
   * @private
   */
  private userDao: IUserDao

  /**
   * Repository logger
   * @private
   */
  private logger: ServiceLogger

  /**
   * Create a new repository instance
   * @param userDao
   * @param logger
   */
  public constructor(userDao: IUserDao, logger: ServiceLogger) {
    this.userDao = userDao
    this.logger = logger
  }

  /**
   * Check if a user exist in the database
   * @param username The username of the user
   * @param email The email of the user
   */
  public async exists(username: string, email?: string): Promise<User | boolean> {
    this.logger.info('exist started: ', username, email)
    const foundUser = await this.userDao.exist(username, email)
    if (foundUser) {
      this.logger.info('exist - ended gracefully with user found', foundUser.username)
      return UserMap.toDomain(foundUser)
    }

    this.logger.info('exist - ended gracefully with user NOT found')
    return false
  }

  /**
   * Save a user to the database
   * @param user The user entity
   */
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
