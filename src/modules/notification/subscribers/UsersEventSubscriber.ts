/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { ServiceLogger } from '@hgc-sdk/logger'
import { IHandle } from '../../../core/domain/events/IHandle'
import { UserDomainEvent, UserEventType } from '../../users/domain/events/UserDomainEvent'
import { DomainEvents } from '../../../core/domain/events/DomainEvents'

export class UsersEventSubscriber implements IHandle<UserDomainEvent> {
  private useCase: any
  private logger: ServiceLogger

  constructor(eventDao: any, logger: ServiceLogger) {
    this.useCase = eventDao
    this.logger = logger
    this.setupSubscriptions()
  }

  /**
   * Setup subscription
   */
  setupSubscriptions(): void {

    // Register a listener method for users sub-domain events
    DomainEvents.register(this.onUserDomainEvent.bind(this), UserDomainEvent.name)
  }


  /**
   * Domain event listener for the user domain
   * @param event
   * @return {Promise<void>}
   * @private
   */
  private async onUserDomainEvent(event: UserDomainEvent): Promise<void> {
    const userId = event.aggregateId
    this.logger.verbose(`onUserDomainEvent: ${event.eventType}]`, event)

    switch (event.eventType) {
      case UserEventType.USER_CREATED:
        const userCreatedEvent = {
          user: userId.toValue(),
          event: event.eventType,
          dateTimeOccurred: event.dateTimeOccurred,
          meta: event.meta
        }

        return await this.useCase.execute(userCreatedEvent)

      case UserEventType.USER_DELETED:
        break

      default:
        break
    }
  }
}
