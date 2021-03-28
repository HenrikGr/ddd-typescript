/**
 * @prettier
 * @copyright (c) 2021 - present, HGC-AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

/**
 * Value object properties interface
 */
interface IValueObjectProps {
  [index: string]: any
}

/**
 * Abstract class implements value objects
 * @class
 */
export abstract class ValueObject<T extends IValueObjectProps> {
  /**
   * The props of the value object are stored in this.props
   * to leave to the subclass to decide getters
   */
  public props: T

  /**
   * Creates a new ValueObject instance
   * @param props
   */
  protected constructor(props: T) {
    this.props = {
      ...props,
    }
  }

  /**
   * Equality comparator for value objects
   * @param vo
   */
  public equals(vo?: ValueObject<T>): boolean {
    if (vo === null || vo === undefined) {
      return false
    }

    if (vo.props === undefined) {
      return false
    }

    return JSON.stringify(this.props) === JSON.stringify(vo.props)
  }
}
