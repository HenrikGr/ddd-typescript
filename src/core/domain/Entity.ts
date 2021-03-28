/**
 * @prettier
 * @copyright (c) 2021 - present, HGC-AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { UniqueEntityID } from './UniqueEntityID'

/**
 * Entity type comparator
 * @param v
 */
const isEntity = (v: any): v is Entity<any> => {
  return v instanceof Entity
}

/**
 * Entity class implementation
 *
 * Entities should be the first place that we think of to put
 * domain logic when we want to express what a particular model,
 * - can do,
 * - when it can do it,
 * - what conditions dictate when it can do that thing.
 *
 * Use Entity to entities to enforce model invariants
 * @class
 */
export abstract class Entity<T> {
  /**
   * The id of the entity and it's readonly since it
   * should not be able to change after instantiated
   */
  protected readonly _id: UniqueEntityID
  /**
   * The props of the entity class are stored in this.props
   * to leave to the subclass to decide getters and setters
   */
  public readonly props: T

  /**
   * Creates a new Entity instance
   * @param props
   * @param id
   */
  constructor(props: T, id?: UniqueEntityID) {
    this._id = id ? id : new UniqueEntityID()
    this.props = props
  }

  /**
   * Equal comparator based on referential equality
   * @param object
   */
  public equals(object?: Entity<T>): boolean {
    if (object == null) {
      return false
    }

    if (this === object) {
      return true
    }

    if (!isEntity(object)) {
      return false
    }

    return this._id.equals(object._id)
  }
}
