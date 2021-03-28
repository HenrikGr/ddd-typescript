/**
 * @prettier
 * @copyright (c) 2020 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { ServiceLogger } from '@hgc-sdk/logger'
import { IBaseDao } from '@hgc-sdk/mongo-db'

/**
 * Implements the AccessTokenModel API
 * @class
 */
export class AccessTokenModel {
  private dao: IBaseDao
  private logger: ServiceLogger

  /**
   * Creates a new AccessTokenModel instance
   * @param dao
   * @param logger
   */
  public constructor(dao: IBaseDao, logger: ServiceLogger) {
    this.dao = dao
    this.logger = logger
  }

  /**
   * Create a new access token - we stored the token in serialized form
   * @param username
   * @param serializedToken
   */
  public async createAccessToken(username: string, serializedToken: string): Promise<any> {
    this.logger.verbose('createAccessToken: Create a new access token: ', serializedToken)
    try {
      const now = new Date()
      const extendedDocument = {
        username: username,
        token: serializedToken,
        createdAt: now,
        updatedAt: now,
      }

      //const collection = await this.getCollection()
      const result = await this.dao.insertOne('sessions', extendedDocument)
      return result === 1
    } catch (err) {
      this.logger.error('createAccessToken: ', err.name, err.message)
      throw new Error(err.message)
    }
  }

  /**
   * Update token by username
   * @param username
   * @param serializedToken
   */
  public async updateAccessToken(username: string, serializedToken: string) {
    this.logger.verbose('updateAccessToken: Update user: ', username)

    try {
      const options = { upsert: true}
      const filter = { username: username }
      const now = new Date()
      const extendedDocument = {
        token: serializedToken,
        updatedAt: now,
      }

      const result = await this.dao.updateOne('sessions', filter, extendedDocument, options)
      return result === 1
    } catch (err) {
      this.logger.error('updateAccessToken: ', err.name, err.message)
      throw new Error(err.message)
    }
  }

  /**
   * Find access token by username
   * @param username
   */
  public async findAccessTokenByUsername(username: string) {
    this.logger.verbose('findAccessTokenByUsername: Get one credential by username: ', username)
    try {
      return await this.dao.findOne('sessions', { username: username })
    } catch (err) {
      this.logger.error('findAccessTokenByUsername: ', err.name, err.message)
      throw new Error(err.message)
    }
  }
}
