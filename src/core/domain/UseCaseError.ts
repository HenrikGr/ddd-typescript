/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

/**
 * Use case error interface
 */
interface IUseCaseError {
  message: string
}

/**
 * Implements an abstract use case error class
 */
export abstract class UseCaseError implements IUseCaseError {
  /**
   * Use case error message
   */
  public readonly message: string

  /**
   * Creates a new UseCaseError instance
   * @param message
   */
  protected constructor(message: string) {
    this.message = message
  }
}
