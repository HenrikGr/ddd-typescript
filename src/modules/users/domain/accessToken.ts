/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { ValueObject } from '../../../core/domain/ValueObject'
import { Result } from '../../../core/common/Result'

/**
 * UserName property interface
 */
export interface IAccessTokenProps {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token: string
  scope: string
  expires_at: Date
}

/**
 * Implements the AccessToken value object
 * @extends ValueObject
 * @class
 */
export class AccessToken extends ValueObject<IAccessTokenProps> {
  /**
   * Creates a new instance of the AccessToken value object
   * @param props
   */
  private constructor(props: IAccessTokenProps) {
    super(props)
  }

  /**
   * Getter for the value
   */
  get value(): IAccessTokenProps {
    return this.props
  }

  /**
   * Factory method to create an instance and apply the validation rules
   * @param props The user name
   */
  public static create(props: IAccessTokenProps): Result<AccessToken> {
    return Result.ok<AccessToken>(new AccessToken(props))
  }
}
