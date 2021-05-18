/**
 * @prettier
 * @copyright (c) 2021 - present, HGC-AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { IDomainEvent } from '../../../../core/domain/events/IDomainEvent'
import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID'

export enum UserEventType {
  USER_CREATED = 'User Created',
  USER_DELETED = 'User Deleted',
}

/**
 * Represent a domain event for user aggregate
 * @class
 */
export class UserDomainEvent implements IDomainEvent {
  public dateTimeOccurred: Date
  public aggregateId: UniqueEntityID
  public eventType: string
  public meta: any

  /**
   * Create a new domain event for the user module
   * @param aggregateId
   * @param type
   * @param meta
   */
  constructor(aggregateId: UniqueEntityID, type: string, meta?: any) {
    this.dateTimeOccurred = new Date()
    this.aggregateId = aggregateId
    this.eventType = type
    this.meta = meta
  }
}
