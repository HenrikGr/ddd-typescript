/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { AppError } from '../../../../core/common/AppError'
import { Result, left, right } from '../../../../core/common/Result'

//import { DomainEvents } from '../../../../core/domain/events/DomainEvents'
import { UseCase } from '../../../../core/domain/UseCase'
import { IUserRepo } from '../../repos/userRepo'

import { DeleteUserDTO } from './DeleteUserDTO'
import { DeleteUserErrors } from './DeleteUserErrors'
import { DeleteUserResponse } from './DeleteUserResponses'

import { User } from '../../domain/User'
import { UserName } from '../../domain/userName'

import { UserDomainEvent } from '../../domain/events/UserDomainEvent'

/**
 * DeleteUser
 * @class
 */
export class DeleteUser implements UseCase<DeleteUserDTO, Promise<DeleteUserResponse>> {
  private userRepo: IUserRepo

  /**
   * Creates a new DeleteUser instance
   * @param userRepo
   */
  constructor(userRepo: IUserRepo) {
    this.userRepo = userRepo
  }

  /**
   * Method to dispatch domain events
   * @param user
   * @protected
   */
  private dispatchDomainEvent(user: User) {
    //const domainEvent = new UserDomainEvent(user.id, 'meta: User deleted successfully')
    //console.log('user domain events before: ', foundUser.domainEvents)
    //DomainEvents.dispatch(domainEvent)
    //console.log('user domain events after: ', foundUser.domainEvents)
    //const userDeletedEvent = new UserDeleted(foundUser.id, 'delete meta')
    //DomainEvents.dispatch(userDeletedEvent)
  }

  /**
   * Validate DTO
   * @param deleteUserDTO
   * @private
   */
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
  public async execute(deleteUserDTO: DeleteUserDTO): Promise<DeleteUserResponse> {

    try {
      // Validate DTO
      const validDTO = await this.validateDTO(deleteUserDTO)
      if (!validDTO.isSuccess) {
        return left(new DeleteUserErrors.ValidationError(validDTO.error)) as DeleteUserResponse
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

      return right(Result.ok<void>())
    } catch (err) {
      return left(new AppError.UnexpectedError(err)) as DeleteUserResponse
    }
  }
}
