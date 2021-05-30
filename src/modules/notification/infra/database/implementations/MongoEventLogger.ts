/**
 * @prettier
 * @copyright (c) 2020 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { IBaseDao } from '@hgc-sdk/mongo-db'
import { ServiceLogger } from '@hgc-sdk/logger'
import { IEventLogger } from '../IEventLogger'
import { UserDomainEvent } from '../../../../users/domain/events/UserDomainEvent'

/**
 * Implements logic to store events in mongo database
 */
export class MongoEventLogger implements IEventLogger {
  /**
   * Base DAO for MongoDb
   * @private
   */
  private dao: IBaseDao

  /**
   * Console logger
   * @private
   */
  private logger : ServiceLogger

  /**
   * Collection name to store the events
   * @private
   */
  private readonly collectionName: string

  /**
   * Creates a new instance
   * @param dao
   * @param logger
   * @param collectionName
   */
  public constructor(dao: IBaseDao, logger: ServiceLogger, collectionName?: string) {
    this.dao = dao
    this.logger = logger
    this.collectionName = collectionName ? collectionName : 'events'
  }

  /**
   * Save a user domain event
   * @param data
   */
  public async saveUserDomainEvent(data: UserDomainEvent): Promise<number> {
    this.logger.verbose('saveUserDomainEvent: ', data)
    try {
      return await this.dao.insertOne(this.collectionName, data)
    } catch (error) {
      throw new Error(error.message)
    }
  }
}
