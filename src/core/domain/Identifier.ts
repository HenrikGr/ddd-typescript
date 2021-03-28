/**
 * @prettier
 * @copyright (c) 2021 - present, HGC-AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */
import { ObjectId, ObjectID } from 'mongodb'

/**
 * Implements identifier features to be used to compare domain entities
 * @class
 */
export class Identifier<T> {
  private readonly value: T

  /**
   * Create a new identifier instance
   * @param value
   */
  constructor(value: T) {
    this.value = value
  }

  /**
   * Equal comparator
   * @param id
   */
  equals(id?: Identifier<T>): boolean {
    if (id === null || id === undefined) {
      return false
    }

    if (!(id instanceof this.constructor)) {
      return false
    }

    return id.toValue() === this.value
  }

  /**
   * Get a string representation
   */
  toString() {
    return String(this.value)
  }

  /**
   * Get the raw value of the identifier
   */
  toValue(): T {
    return this.value
  }
}
