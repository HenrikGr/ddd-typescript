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
  private userRepo: IUserRepo
  private logger: ServiceLogger

  constructor(userRepo: IUserRepo, logger: ServiceLogger) {
    this.userRepo = userRepo
    this.logger = logger
  }

  private async validateDTO(deleteUserDTO: DeleteUserDTO) {
    const userName = UserName.create(deleteUserDTO.username)
    const combinedResult = Result.combine([userName])

    return {
      isSuccess: combinedResult.isSuccess,
      error: combinedResult.isFailure ? combinedResult.errorValue() : '',
      userName: userName.isSuccess ? userName.getValue() : userName.errorValue(),
    }
  }

  /**
   * Execute the use case
   * @param deleteUserDTO
   */
  public async execute(deleteUserDTO: DeleteUserDTO): Promise<UseCaseResponse> {
    this.logger.verbose('execute: ', deleteUserDTO)

    try {
      // Validate DTO
      const validDTO = await this.validateDTO(deleteUserDTO)
      if (!validDTO.isSuccess) {
        return left(new DeleteUserErrors.ValidationError(validDTO.error)) as UseCaseResponse
      }

      /*
      // Check if user exist and validate conflicts
      const foundUser = <User>await this.userRepo.exists(validDTO.userName.value)
      if (!foundUser) {
        return left(new DeleteUserErrors.UserNotFound(validDTO.userName.value))
      }

      // Delete the user entity from database
      const isDeleted = await this.userRepo.delete(foundUser)
      if (!isDeleted) {
        return left(new DeleteUserErrors.UnableToDeleteUser(foundUser.username.value))
      }

      this.dispatchDomainEvent(foundUser)

       */

      this.logger.verbose('execute: ended gracefully')
      return right(Result.ok<void>())
    } catch (err) {
      return left(new AppError.UnexpectedError(err)) as UseCaseResponse
    }
  }
}
