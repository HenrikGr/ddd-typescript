/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { IHandle } from '../../../../core/domain/events/IHandle'
import { UserDomainEvent } from '../../../users/domain/events/UserDomainEvent'
import { DomainEvents } from '../../../../core/domain/events/DomainEvents'

/**
 * Implements logic to setup listener to the UserDomainEvent Domain event
 * @class
 */
export class UserDomainEvents implements IHandle<UserDomainEvent> {
  private readonly eventLogger: any

  constructor(eventLogger: any) {
    this.eventLogger = eventLogger
    this.setupSubscriptions()
  }

  /**
   * Setup subscription
   */
  setupSubscriptions(): void {
    DomainEvents.register(this.onUserDomainEvent.bind(this), UserDomainEvent.name)
  }


  /**
   * Listener function for the event
   * @param event
   * @return {Promise<void>}
   * @private
   */
  private async onUserDomainEvent(event: UserDomainEvent): Promise<void> {
    const userId = event.aggregateId
    //const user = DomainEvents.findMarkedAggregateByID(userId)
    console.info(`[Domain Event UserCreated Received]:`, event)

    const userCreatedEvent = {
      user: userId.toValue(),
      event: event.eventType,
      dateTimeOccurred: event.dateTimeOccurred,
      meta: event.meta
      //username: event.user.username.value,
      //email: event.user.email.value,
    }

    await this.eventLogger.save(userCreatedEvent)
    return
  }
}
