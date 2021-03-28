/**
 * @prettier
 * @copyright (c) 2021 - present, HGC-AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { Entity } from './Entity'
import { IDomainEvent } from './events/IDomainEvent'
import { DomainEvents } from './events/DomainEvents'
import { UniqueEntityID } from './UniqueEntityID'

/**
 * Aggregate root class implementation
 *
 * An aggregate root is an extended entity object and is the instance we refer to
 * for lookups. Member objects within the aggregate root boundary can not be reference
 * direct from outside the aggregate root, to maintain consistency.
 *
 * Aggregate roots does also provide the role as a publisher and can dispatch domain
 * events which can be used to co-locate business logic to subdomains.
 *
 * An "aggregate" is a cluster of associated objects, an Entity objects containing
 * ValueObject that encapsulate business validation rules, that we treat as a unit for
 * the purpose of data changes."
 *
 * @extends Entity
 * @class
 */
export abstract class AggregateRoot<T> extends Entity<T> {
  /**
   * Domain events list for the aggregate root
   */
  protected _domainEvents: IDomainEvent[] = []

  /**
   * Getter for the aggregate root id
   */
  get id(): UniqueEntityID {
    return this._id
  }

  /**
   * Getter for the domain events created
   */
  get domainEvents(): IDomainEvent[] {
    return this._domainEvents
  }

  /**
   * Add a domain event for this aggregate and mark the aggregate instance to the
   * domain events controller where it eventually will be dispatched.
   * @param domainEvent
   */
  public addDomainEvent(domainEvent: IDomainEvent): void {
    // Add the domain event to this aggregate's list of domain events
    this._domainEvents.push(domainEvent)
    // Mark this aggregate to the Domain Events controller
    DomainEvents.markAggregateForDispatch(this)
    // Log the domain event
    this.logDomainEventAdded(domainEvent)
  }

  public dispatchDomainEvents() {
    DomainEvents.dispatchEventsForAggregate(this.id)
    this.clearEvents()
  }

  /**
   * Clear domain events for this aggregate root
   */
  public clearEvents(): void {
    this._domainEvents.splice(0, this._domainEvents.length)
  }

  /**
   * Log added domain event for this aggregate root
   * @param domainEvent
   */
  protected logDomainEventAdded(domainEvent: IDomainEvent): void {
    console.info(`[Domain Event Created]:`, domainEvent )
  }
}
