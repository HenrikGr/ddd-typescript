/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { Result } from '../../../core/common/Result'
import { Guard } from '../../../core/common/Guard'
import { AggregateRoot } from '../../../core/domain/AggregateRoot'
import { UniqueEntityID } from '../../../core/domain/UniqueEntityID'

import { UserDomainEvent, UserEventType } from './events/UserDomainEvent'
import { UserName } from './userName'
import { UserEmail } from './userEmail'
import { UserCredential } from './userCredential'
import { UserScope } from './userScope'

/**
 * User entity properties interface
 */
export interface IUserProps {
  username: UserName
  email: UserEmail
  credential: UserCredential
  scope: UserScope
  isEmailVerified: boolean
  isAdminUser: boolean
  isDeleted: boolean
}

/**
 * Implements User as an aggregate
 * An aggregate root is an Entity object with more responsibilities.
 *
 * @extends AggregateRoot
 * @class
 */
export class User extends AggregateRoot<IUserProps> {
  /**
   * Creates a new User entity instance
   * @param {IUserProps} props
   * @param {UniqueEntityID} id
   * @private
   */
  private constructor(props: IUserProps, id?: UniqueEntityID) {
    super(props, id)
  }

  /**
   * Getter for id in aggregation root
   */
  get id(): UniqueEntityID {
    return this._id
  }

  /**
   * Getter for username
   */
  get username(): UserName {
    return this.props.username
  }

  /**
   * Getter for user email
   */
  get email(): UserEmail {
    return this.props.email
  }

  /**
   * Getter for credential
   */
  get credential(): UserCredential {
    return this.props.credential
  }

  /**
   * Getter for user scope
   */
  get scope(): UserScope {
    return this.props.scope
  }

  /**
   * Getter for email verified flag
   */
  get isEmailVerified(): boolean {
    return this.props.isEmailVerified
  }

  /**
   * Getter for is admin user flag
   */
  get isAdminUser(): boolean {
    return this.props.isAdminUser
  }

  /**
   * Getter for is deleted flag
   */
  get isDeleted(): boolean {
    return this.props.isDeleted
  }

  /**
   * Factory method creating the User entity
   * @param {IUserProps} props
   * @param {UniqueEntityID} id
   * @return {Result<User>}
   */
  public static create(props: IUserProps, id?: UniqueEntityID): Result<User> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.username, argumentName: 'username' },
      { argument: props.email, argumentName: 'email' }
    ]);

    if (!guardResult.isSuccess) {
      return Result.fail<User>(guardResult.message)
    }

    const user = new User({ ...props }, id)

    /**
     * if a new user entity was created
     * Add a domain event
     */
    if(!id) {
      const userCreatedEvent = new UserDomainEvent(UserEventType.USER_CREATED, user.id, )
      user.addDomainEvent(userCreatedEvent)
    }

    return Result.ok<User>(user);
  }
}
