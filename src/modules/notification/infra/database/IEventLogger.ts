/**
 * @prettier
 * @copyright (c) 2020 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { UserDomainEvent } from '../../../users/domain/events/UserDomainEvent'

/**
 * EventLogger interface for storing domain events in a database
 */
export interface IEventLogger {
  saveUserDomainEvent(event: UserDomainEvent): Promise<number>
}
