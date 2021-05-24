/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { ServiceLogger } from '@hgc-sdk/logger'
import { AppError } from '../../../../core/common/AppError'
import { Result, left, right, Either } from '../../../../core/common/Result'

import { UseCase } from '../../../../core/domain/UseCase'

import { IUserRepo } from '../../repos/userRepo'
import { DeleteUserDTO } from './DeleteUserDTO'
import { DeleteUserErrors } from './DeleteUserErrors'

import { User } from '../../domain/User'
import { UserName } from '../../domain/userName'

/**
 * Use case response
 */
type UseCaseResponse = Either<
  | DeleteUserErrors.ValidationError
  | DeleteUserErrors.UserNotFound
  | DeleteUserErrors.UserIsMarkedForDeletion
  | AppError.UnexpectedError
  | Result<any>,
  Result<void>
>

/**
 * Implementation of the DeleteUser use case
 */
export class DeleteUser implements UseCase<DeleteUserDTO, Promise<UseCaseResponse>> {
  /**
   * User repository
   * @private
   */
  private userRepo: IUserRepo

  /**
   * Use case logger
   * @private
   */
  private logger: ServiceLogger

  /**
   * Create a new use case instance
   * @param userRepo
   * @param logger
   */
  constructor(userRepo: IUserRepo, logger: ServiceLogger) {
    this.userRepo = userRepo
    this.logger = logger
  }

  /**
   * Run the use case implementation
   * @param deleteUserDTO
   */
  public async execute(deleteUserDTO: DeleteUserDTO): Promise<UseCaseResponse> {
    this.logger.info('execute - started ', deleteUserDTO.username)

    try {
      // Check if current user is authenticated
      // Check if user to be deleted is the same as current user
      // Check if current user is administrator
      if (
        !deleteUserDTO.session.user ||
        deleteUserDTO.session.user.username !== deleteUserDTO.username ||
        !deleteUserDTO.session.user.isAdminUser
      ) {
        return left(new DeleteUserErrors.NotAuthorized()) as UseCaseResponse
      }

      // Create a userName value object
      const userNameResult = UserName.create(deleteUserDTO.username)
      if (!userNameResult.isSuccess) {
        return left(new DeleteUserErrors.ValidationError(userNameResult.error.toString())) as UseCaseResponse
      }

      const userName = userNameResult.getValue()

      // Check if user exist
      const foundUser = <User>await this.userRepo.exists(userName.value)
      if (!foundUser) {
        return left(new DeleteUserErrors.UserNotFound(userName.value))
      }

      // Only administrators should be able to delete a users already marked for deletion
      if (foundUser.isDeleted && !deleteUserDTO.session.user.isAdminUser) {
        return left(new DeleteUserErrors.UserIsMarkedForDeletion(userName.value)) as UseCaseResponse
      }

      // Delete the user entity from database
      const isDeleted = await this.userRepo.delete(foundUser)
      if (!isDeleted) {
        return left(new DeleteUserErrors.UnableToDeleteUser(foundUser.username.value))
      } else {
        // User is persisted and it is safe to dispatch domain events in the aggregate root (User)
        //foundUser.dispatchDomainEvents()
      }

      this.logger.info('execute - ended gracefully')
      return right(Result.ok<void>())
    } catch (err) {
      return left(new AppError.UnexpectedError(err)) as UseCaseResponse
    }
  }
}
