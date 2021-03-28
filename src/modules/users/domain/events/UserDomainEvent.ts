/**
 * @prettier
 * @copyright (c) 2021 - present, HGC-AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { IDomainEvent } from '../../../../core/domain/events/IDomainEvent'
import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID'

/**
 * Represent a domain event for user aggregate
 * @class
 */
export class UserDomainEvent implements IDomainEvent {
  public dateTimeOccurred: Date
  public meta: any
  public aggregateId: UniqueEntityID
  public eventType: string = 'UserDomainEvent'

  constructor(aggregateId:UniqueEntityID , meta: any, type?: string) {
    this.dateTimeOccurred = new Date()
    this.aggregateId = aggregateId
    this.meta = meta
    this.eventType = 'UserCreated'

    console.info(`[UserDomainEvent Created]:`, meta)
  }
}
