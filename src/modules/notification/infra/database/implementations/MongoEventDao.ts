/**
 * @prettier
 * @copyright (c) 2020 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { IBaseDao } from '@hgc-sdk/mongo-db'
import { ServiceLogger } from '@hgc-sdk/logger'
import { IEventDao } from '../IEventDao'

/**
 * Implements the data access object for domain events
 */
export class MongoEventDao implements IEventDao {
  private dao: IBaseDao
  private logger : ServiceLogger
  private readonly collectionName: string

  public constructor(dao: IBaseDao, logger: ServiceLogger, collectionName?: string) {
    this.dao = dao
    this.logger = logger
    this.collectionName = collectionName ? collectionName : 'events'
  }

  /**
   * Create a event data
   * @param data
   */
  public async create(data: any): Promise<boolean> {
    this.logger.verbose('create: ', data)
    try {
      const result = await this.dao.insertOne(this.collectionName, data)
      return result === 1
    } catch (error) {
      throw new Error(error.message)
    }
  }
}
