/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { IUserRepo } from '../userRepo'
import { UserMap } from '../../mappers/userMap'
import { User } from '../../domain/User'

/**
 * Implements user repository for MongoDb
 * @class
 */
export class MongoUserRepo implements IUserRepo {
  private userModel: any

  /**
   * Creates a new MongoUserRepo instance
   * @param userModel
   */
  public constructor(userModel: any) {
    this.userModel = userModel
  }

  /**
   * Check if user already exist in the database
   * @param username
   * @param email
   */
  public async exists(username: string, email?: string): Promise<User | boolean> {
    const foundUser = await this.userModel.exist(username, email)
    if (foundUser) {
      return UserMap.toDomain(foundUser)
    }
    return false
  }

  /**
   * Save user to the database
   * @param user
   */
  public async save(user: User): Promise<boolean> {
    // Create a new user
    const rawUser = await UserMap.toPersistence(user)
    const isUserCreated = await this.userModel.createUser(rawUser)

    // Return save result
    return isUserCreated
  }

  /**
   * Delete user
   * @param user
   */
  public async delete(user: User): Promise<boolean> {
    //const rawUser = await UserMap.toPersistence(user)
    //console.log('delete user: ', rawUser)
    return await this.userModel.deleteUser(user.username.value)
  }
}
