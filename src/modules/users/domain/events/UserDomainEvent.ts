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
 */
export class UserDomainEvent implements IDomainEvent {
  dateTimeOccurred: Date
  eventType: UserEventType
  aggregateId: UniqueEntityID
  meta: object

  /**
   * Create a new domain event for the user module
   * @param type
   * @param aggregateId
   * @param meta
   */
  constructor(type: UserEventType, aggregateId: UniqueEntityID, meta: object = {}) {
    this.dateTimeOccurred = new Date()
    this.eventType = type
    this.aggregateId = aggregateId
    this.meta = meta
  }
}
