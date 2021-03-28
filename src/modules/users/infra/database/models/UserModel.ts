/**
 * @prettier
 * @copyright (c) 2020 - present, HGC-AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { ServiceLogger } from '@hgc-sdk/logger'
import { IBaseDao } from '@hgc-sdk/mongo-db'

/**
 * Implements the user model API
 * @class
 */
export class UserModel {
  private dao: IBaseDao
  private logger: ServiceLogger

  /**
   * Creates a new UserModel instance
   * @param logger
   * @param dao
   */
  public constructor(dao: IBaseDao, logger: ServiceLogger) {
    this.dao = dao
    this.logger = logger
  }

  public async exist(username: string, email?: string): Promise<any> {
    this.logger.info('exist: Get user by: ', username, email)

    try {
      let filter = {}
      if (email) {
        filter = { $or: [{ username: username }, { email: email }] }
      } else {
        filter = { username: username }
      }

      return await this.dao.findOne('accounts', filter)
    } catch (err) {
      this.logger.error('findUsers: ', err.name, err.message)
      throw new Error(err.message)
    }
  }

  /**
   * Create a new user
   * @param {object} document
   */
  public async createUser(document: object): Promise<any> {
    this.logger.verbose('signUpUser: Create a new user: ', JSON.stringify(document))
    try {
      const now = new Date()
      const extendedDocument = {
        ...document,
        createdAt: now,
        updatedAt: now,
      }

      const result = await this.dao.insertOne('accounts', extendedDocument)
      return result === 1
    } catch (err) {
      this.logger.error.log('signUpUser: ', err.name, err.message)
      throw new Error(err.message)
    }
  }

  /**
   * Mark user for deletion
   * @param username
   */
  public async markUserForDeletion(username: string): Promise<boolean> {
    this.logger.verbose('markUserForDeletion: Set deletion flag for user: ', username)

    try {
      const options = { upsert: true }
      const filter = { username: username }
      const now = new Date()
      const extendedDocument = {
        isDeleted: true,
        updatedAt: now,
      }

      const result = await this.dao.updateOne('accounts', filter, extendedDocument, options)
      return result === 1
    } catch (err) {
      this.logger.error('markUserForDeletion: ', err.name, err.message)
      throw new Error(err.message)
    }
  }

  /**
   * Update user by username
   * @param username
   * @param document
   */
  public async updateUserByUsername(username: string, document: object): Promise<any> {
    this.logger.verbose('updateUserByUsername: Update user: ', username)
    try {
      const options = { upsert: true }
      const filter = { username: username }
      const now = new Date()
      const extendedDocument = {
        ...document,
        updatedAt: now,
      }

      const result = await this.dao.updateOne('accounts', filter, extendedDocument, options)
      return result === 1
    } catch (err) {
      this.logger.error('updateUserByUsername: ', err.name, err.message)
      throw new Error(err.message)
    }
  }

  /**
   * Delete a user
   * @param username
   * @param markForDeletion
   */
  public async deleteUser(username: string, markForDeletion: boolean = false): Promise<boolean> {
    try {
      const filter = { username: username }

      if (markForDeletion) {
        const options = { upsert: true }
        const now = new Date()
        const extendedDocument = {
          isDeleted: true,
          updatedAt: now,
        }

        const result = await this.dao.updateOne('accounts', filter, extendedDocument, options)
        return result === 1
      } else {
        return await this.dao.deleteOne('accounts', filter)
      }
    } catch (error) {
      throw new Error(error.message)
    }
  }
}
