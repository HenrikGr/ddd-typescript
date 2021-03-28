/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { ValueObject } from '../../../core/domain/ValueObject'
import { Result } from '../../../core/common/Result'
import { Guard } from '../../../core/common/Guard'

/**
 * UserName property interface
 */
export interface IUserNameProps {
  username: string
}

/**
 * Implements the UserName value object that encapsulate
 * domain level validation for a user email address
 * @extends ValueObject
 * @class
 */
export class UserName extends ValueObject<IUserNameProps> {
  /**
   * Validation rules
   */
  public static maxLength: number = 15
  public static minLength: number = 5

  /**
   * Creates a new instance of the UserName value object
   * @param props
   */
  private constructor(props: IUserNameProps) {
    super(props)
  }

  /**
   * Getter for the value
   */
  get value(): string {
    return this.props.username
  }

  /**
   * Factory method to create an instance and apply the validation rules
   * @param username The user name
   */
  public static create(username: string): Result<UserName> {
    const minLengthResult = Guard.againstAtLeast(this.minLength, username, 'username')
    if (!minLengthResult.isSuccess) {
      return Result.fail<UserName>(minLengthResult.message)
    }

    const maxLengthResult = Guard.againstAtMost(this.maxLength, username, 'username')
    if (!maxLengthResult.isSuccess) {
      return Result.fail<UserName>(maxLengthResult.message)
    }

    return Result.ok<UserName>(new UserName({username: username}))
  }
}
