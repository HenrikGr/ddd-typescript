/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { Entity } from '../../../core/domain/Entity'
import { UniqueEntityID } from '../../../core/domain/UniqueEntityID'
import { Result } from '../../../core/common/Result'
import { Guard } from '../../../core/common/Guard'

/**
 * Implements UserId entity class
 * @extends Entity
 * @class
 */
export class UserId extends Entity<any> {
  private constructor(id?: UniqueEntityID) {
    super(null, id)
  }

  /**
   * Getter for the UniqueEntityID object
   */
  get id(): UniqueEntityID {
    return this._id
  }

  /**
   * Factory method to create an user id entity
   * @param userId
   */
  public static create(userId: UniqueEntityID): Result<UserId> {
    const result = Guard.againstInvalidEntityId(userId.toValue(), 'userId')
    if (!result.isSuccess) {
      return Result.fail<UserId>(result.message)
    }

    return Result.ok<UserId>(new UserId(userId))
  }
}
