/**
 * @prettier
 * @copyright (c) 2020 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { ServiceLogger } from '@hgc-sdk/logger'
import { IBaseDao } from '@hgc-sdk/mongo-db'

export interface ISessionDao {
  updateSession(username: string, serializedToken: string): Promise<boolean>
  getSession(username: string): Promise<any>
}

/**
 * Implements the AccessTokenModel API
 * @class
 */
export class SessionDao {
  private dao: IBaseDao
  private logger: ServiceLogger
  private readonly collectionName: string

  /**
   * Creates a new AccessTokenModel instance
   * @param dao
   * @param logger
   * @param collectionName
   */
  public constructor(dao: IBaseDao, logger: ServiceLogger, collectionName?: string) {
    this.dao = dao
    this.logger = logger
    this.collectionName = collectionName ? collectionName : 'sessions'
  }

  protected serialize(token: string) {
    return JSON.stringify(token)
  }

  protected deserialize(serializedToken: string) {
    return JSON.parse(serializedToken)
  }

  /**
   * Update token by username
   * @param username
   * @param token
   */
  public async updateSession(username: string, token: string): Promise<boolean> {
    this.logger.verbose('updateSession: ', username)

    try {
      const options = { upsert: true}
      const filter = { username: username }
      const serializedToken = {
        token: this.serialize(token),
      }

      const result = await this.dao.updateOne(this.collectionName, filter, serializedToken, options)
      this.logger.verbose('updateSession: success ', Boolean(result))
      return result === 1
    } catch (err) {
      this.logger.error('updateSession: ', err.name, err.message)
      throw new Error(err.message)
    }
  }

  /**
   * Find access token by username
   * @param username
   */
  public async getSession(username: string): Promise<string> {
    this.logger.verbose('getSession: ', username)
    try {
      const session = await this.dao.findOne(this.collectionName, { username: username })
      return this.deserialize(session)
    } catch (err) {
      this.logger.error('findSession: ', err.name, err.message)
      throw new Error(err.message)
    }
  }
}
