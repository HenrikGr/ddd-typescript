/**
 * @prettier
 * @copyright (c) 2021 - present, HGC-AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { ValueObject } from '../../../core/domain/ValueObject'
import { Result } from '../../../core/common/Result'
import { Guard } from '../../../core/common/Guard'

/**
 * UserEmail interface
 */
export interface IUserEmailProps {
  email: string
}

/**
 * Implements the logic for UserEmail object and encapsulate
 * domain level validation for a user email addresses.
 */
export class UserEmail extends ValueObject<IUserEmailProps> {
  /**
   * Creates a new UserEmail instance
   * @param props
   */
  private constructor(props: IUserEmailProps) {
    super(props)
  }

  /**
   * Getter for the email value
   */
  get value(): string {
    return this.props.email
  }

  /**
   * Factory method to create an instance of UserEmail
   * Validates against an invalid email address format
   * which includes undefined and null
   * @param email
   */
  public static create(email: string): Result<UserEmail> {
    const isValid = Guard.againstInvalidEmailAddress(email, 'email')
    if (!isValid.isSuccess) {
      return Result.fail<UserEmail>(isValid.message)
    }

    return Result.ok<UserEmail>(new UserEmail({ email: email }))
  }
}
