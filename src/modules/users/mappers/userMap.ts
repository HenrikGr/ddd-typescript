/**
 * @prettier
 * @copyright (c) 2019 - present, HGC-AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { Mapper } from '../../../core/infra/Mapper'
import { UniqueEntityID } from '../../../core/domain/UniqueEntityID'
import { User } from '../domain/User'
import { UserName } from '../domain/userName'
import { UserEmail } from '../domain/userEmail'
import { UserScope } from '../domain/userScope'
import { UserCredential } from '../domain/userCredential'
import { CreateUserDTO } from '../dtos/CreateUserDTO'
import { UpdateUserDTO } from '../dtos/UpdateUserDTO'

/**
 * Implements data mapper logic for the User
 *
 * The responsibility of a Mapper is to make all the transformations:
 * - From Domain to DTO
 * - From Domain to Persistence
 * - From Persistence to Domain
 *
 * @implements Mapper
 * @class UserMap
 */
export class UserMap implements Mapper<User> {

  public static toUserName(raw: any): UserName {
    const resultUserName = UserName.create(raw.username)
    return resultUserName.getValue()
  }

  public static toUserEmail(raw: any): UserEmail {
    const resultUserName = UserEmail.create(raw.email)
    return resultUserName.getValue()
  }

  public static toUserScope(raw: any): UserScope {
    const resultUserName = UserScope.create(raw.scope)
    return resultUserName.getValue()
  }

  public static async toUserCredential(raw: any): Promise<UserCredential> {
    const resultUserName = await UserCredential.create(raw.credentials.password, true)
    return resultUserName.getValue()
  }

  /**
   * Map raw user data from the data model to a User domain entity
   * @return {Promise<User>}
   */
  public static async toDomain(raw: any): Promise<User> {
    const rawUser = raw
    const resultUser = User.create(
      {
        username: this.toUserName(raw),
        email: this.toUserEmail(raw),
        scope: this.toUserScope(raw),
        credential: await this.toUserCredential(raw),
        isAdminUser: rawUser.isAdminUser,
        isDeleted: rawUser.isDeleted,
        isEmailVerified: rawUser.isEmailVerified,
      },
      new UniqueEntityID(rawUser._id)
    )

    return resultUser.getValue()
  }

  /**
   * Map user domain entity to persistent format.
   * @param user
   */
  public static toCreateUserDTO(user: User): CreateUserDTO {
    return {
      _id: user.id.toString(),
      username: user.username.value,
      email: user.email.value,
      credentials: {
        password: user.credential.value,
      },
      scope: user.scope.value,
      isEmailVerified: user.isEmailVerified,
      isAdminUser: user.isAdminUser,
      isDeleted: user.isDeleted,
    }
  }

  /**
   *
   * @param user
   */
  public static toUpdateUserDTO(user: User): UpdateUserDTO {
    return {
      username: user.username.value,
      email: user.email.value,
      scope: user.scope.value,
      isEmailVerified: user.isEmailVerified,
      isAdminUser: user.isAdminUser,
      isDeleted: user.isDeleted,
    }
  }
}
