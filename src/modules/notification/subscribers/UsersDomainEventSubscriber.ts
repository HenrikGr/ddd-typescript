/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { ServiceLogger } from '@hgc-sdk/logger'
import { DomainEvents } from '../../../core/domain/events/DomainEvents'
import { IHandle } from '../../../core/domain/events/IHandle'

import { UserDomainEvent, UserEventType } from '../../users/domain/events/UserDomainEvent'
import { IEventLogger } from '../infra/database/IEventLogger'

/**
 * Implements logic to subscribe to domain events for the users module
 */
export class UsersDomainEventSubscriber implements IHandle<UserDomainEvent> {
  /**
   * EventLogger to save events to a database
   * @private
   */
  private eventLogger: IEventLogger

  /**
   * Console logger
   * @private
   */
  private logger: ServiceLogger

  /**
   * Creates a new instance
   * @param eventDao
   * @param logger
   */
  constructor(eventDao: IEventLogger, logger: ServiceLogger) {
    this.eventLogger = eventDao
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
   * Domain event listener for the user domain events
   * @param event
   * @private
   */
  private async onUserDomainEvent(event: UserDomainEvent): Promise<void> {
    const userId = event.aggregateId
    this.logger.info(`onUserDomainEvent: ${event.eventType}`)

    if (event.eventType === UserEventType.USER_CREATED) {
      try {
        const domainEvent = {
          ...event,
          meta: {
            description: 'New user created in database',
            user: userId.toValue(),
          }
        }

        await this.eventLogger.saveUserDomainEvent(domainEvent)
      } catch (err) {
        this.logger.error('onUserDomainEvent: ', err.message)
      }
    }

  }
}
