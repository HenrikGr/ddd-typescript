/**
 * @prettier
 * @copyright (c) 2021 - present, HGC-AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { IDomainEvent } from './IDomainEvent'
import { AggregateRoot } from '../AggregateRoot'
import { UniqueEntityID } from '../UniqueEntityID'

interface IHandlersMap {
  [name: string]: any
}

/**
 * Implements domain events handler logics.
 */
export class DomainEvents {
  /**
   * Handler map for domain events
   */
  private static handlersMap: IHandlersMap = {}
  /**
   * Map for aggregate roots being marked for dispatch
   */
  private static markedAggregates: AggregateRoot<any>[] = []

  /**
   * Dispatching all domain events from an aggregate root
   * @param aggregate
   */
  private static dispatchAggregateEvents(aggregate: AggregateRoot<any>): void {
    const domainEvents = aggregate.domainEvents
    domainEvents.forEach((event: IDomainEvent) => {
      this.dispatch(event)
    })
  }

  /**
   * Removes an aggregate from the marked list.
   * @param aggregate
   */
  private static removeAggregateFromMarkedDispatchList(aggregate: AggregateRoot<any>): void {
    const index = this.markedAggregates.findIndex((a) => a.equals(aggregate))
    this.markedAggregates.splice(index, 1)
  }

  /**
   * Finds an aggregate within the list of marked aggregates
   * @param id
   */
  private static findMarkedAggregateByID(id: UniqueEntityID): AggregateRoot<any> | null {
    let found = null
    for (let aggregate of this.markedAggregates) {
      if (aggregate.id.equals(id)) {
        found = aggregate
      }
    }
    return found
  }

  /**
   * Called by aggregate root objects when they add a Domain Event.
   * @param aggregate
   */
  public static markAggregateForDispatch(aggregate: AggregateRoot<any>): void {
    const aggregateFound = !! this.findMarkedAggregateByID(aggregate.id)
    if (!aggregateFound) {
      this.markedAggregates.push(aggregate)
    }
  }

  /**
   * Dispatch events from for the aggregate root using the aggregate roots id
   * @param id
   */
  public static dispatchEventsForAggregate(id: UniqueEntityID): void {
    const aggregate = this.findMarkedAggregateByID(id)
    if (aggregate) {
      // Dispatch all domain events in the aggregate root
      this.dispatchAggregateEvents(aggregate)
      // Clear all added domain events in the aggregate root.
      aggregate.clearEvents()
      // Remove the aggregate from this controller
      this.removeAggregateFromMarkedDispatchList(aggregate)
    }
  }

  /**
   * Register a handler to a domain event.
   * @param callback The listener function subscribing on domain event.
   * @param eventClassName
   */
  public static register(callback: (event: IDomainEvent) => void, eventClassName: string): void {
    if (!this.handlersMap.hasOwnProperty(eventClassName)) {
      this.handlersMap[eventClassName] = [];
    }
    this.handlersMap[eventClassName].push(callback);
  }

  /**
   * Invokes all of the registered subscribers to a particular domain event
   * @param event
   */
  public static dispatch(event: IDomainEvent): void {
    const eventClassName: string = event.constructor.name
    if (this.handlersMap.hasOwnProperty(eventClassName)) {
      const handlers = this.handlersMap[eventClassName]
      for (let handler of handlers) {
        handler(event)
      }
    }
  }

  /**
   * Clear handlers - useful for testing
   */
  public static clearHandlers(): void {
    this.handlersMap = {}
  }

  /**
   * Clear marked aggregates - useful for testing
   */
  public static clearMarkedAggregates(): void {
    this.markedAggregates = []
  }
}
