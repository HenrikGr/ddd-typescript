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
 * UserScopes property interface
 */
export interface IUserScopeProps {
  scope: string
}

/**
 * Implements the UserScope value object that encapsulate
 * domain level validation for a user email address
 *
 * @extends ValueObject
 * @class
 */
export class UserScope extends ValueObject<IUserScopeProps> {
  /**
   * Validation rules
   */

  /**
   * Creates a new instance of the UserScopes value object
   * @param props
   */
  private constructor(props: IUserScopeProps) {
    super(props)
  }

  /**
   * Getter for the value
   */
  get value(): string {
    return this.props.scope
  }

  /**
   * Factory method to create an instance and apply the validation rules
   * @param scope
   */
  public static create(scope: string): Result<UserScope> {
    const usernameResult = Guard.againstNullOrUndefined(scope, 'scope')
    if (!usernameResult.isSuccess) {
      return Result.fail<UserScope>(usernameResult.message)
    }

    return Result.ok<UserScope>(new UserScope({ scope: scope}))
  }
}
