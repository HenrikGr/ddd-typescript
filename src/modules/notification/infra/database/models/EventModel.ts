/**
 * @prettier
 * @copyright (c) 2020 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */
import { IBaseDao } from '@hgc-sdk/mongo-db'

/**
 * Implements the EventModel API
 * @class
 */
export class EventModel {
  private dao: IBaseDao

  /**
   * Creates a new UserModel instance
   * @param dao
   */
  public constructor(dao: IBaseDao) {
    this.dao = dao
  }

  /**
   * Create a domain event
   * @param event
   */
  public async createDomainEvent(event: object): Promise<any> {
    try {
      const result = await this.dao.insertOne('events', event)
      return result === 1
    } catch (error) {
      throw new Error(error.message)
    }
  }
}
