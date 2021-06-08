/**
 * @prettier
 * @copyright (c) 2019 - present, HGC-AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { generateHash, verifyHash } from '@hgc-sdk/crypto'
import { ValueObject } from '../../../core/domain/ValueObject'
import { Result } from '../../../core/common/Result'
import { Guard } from '../../../core/common/Guard'

/**
 * UserCredentialsProp interface
 */
export interface ICredentialsProps {
  password: string
}

/**
 * Implements the logic to create UserCredential objects
 *
 * @extends ValueObject
 * @class UserCredential
 */
export class UserCredential extends ValueObject<ICredentialsProps> {
  /**
   * Creates a new UserCredential instance
   * @param props
   * @private
   */
  private constructor(props: ICredentialsProps) {
    super(props)
  }

  /**
   * Getter for the UserCredential value
   */
  get value(): string {
    return this.props.password
  }

  /**
   * Generate salt and hash for the password
   * @param password
   * @private
   */
  private static async generateHash(password: string): Promise<string> {
    return await generateHash(password)
  }

  /**
   * Compare a plain password text with this instance hashed password
   * @param password
   */
  public async compare(password: string) {
    return await verifyHash(password, this.value)
  }

  /**
   * Factory method to create an instance of UserCredential.
   * Validates against an invalid password format
   * @param password The password
   * @param isHashed If the password is already hashed (from a database)
   */
  public static async create(password: string, isHashed?: boolean): Promise<Result<UserCredential>> {
    if (isHashed) {
      return Result.ok<UserCredential>(new UserCredential({ password: password }))
    } else {
      const guardResult = Guard.againstInvalidPasswordFormat(password, 'password')
      if (!guardResult.isSuccess) {
        return Result.fail<UserCredential>(guardResult.message)
      }

      const hashedPassword = await this.generateHash(password)
      return Result.ok<UserCredential>(new UserCredential({ password: hashedPassword }))
    }
  }
}
