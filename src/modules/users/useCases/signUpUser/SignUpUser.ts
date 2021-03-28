/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { AppError } from '../../../../core/common/AppError'
import { Result, left, right } from '../../../../core/common/Result'

import { DomainEvents } from '../../../../core/domain/events/DomainEvents'
import { UserDomainEvent } from '../../domain/events/UserDomainEvent'

import { UseCase } from '../../../../core/domain/UseCase'
import { SignUpUserDTO } from './SignUpUserDTO'
import { SignUpUserResponse } from './SignUpUserResponse'
import { SignUpUserErrors } from './SignUpUserErrors'

import { IUserRepo } from '../../repos/userRepo'

import { User } from '../../domain/User'
import { UserName } from '../../domain/userName'
import { UserEmail } from '../../domain/userEmail'
import { UserCredential } from '../../domain/userCredential'

/**
 * Implements sign up use case
 * @class
 */
export class SignUpUser implements UseCase<SignUpUserDTO, Promise<SignUpUserResponse>> {
  private userRepo: IUserRepo

  /**
   * Creates a new SignUpUser instance
   * @param userRepo The user repository
   */
  constructor(userRepo: IUserRepo) {
    this.userRepo = userRepo
  }

  /**
   * Method to use to publish domain events for the use case
   * @param user
   * @protected
   */
  private dispatchDomainEvent(user: User) {
    //const domainEvent = new UserDomainEvent(user.id, 'meta: User saved successfully')
    //DomainEvents.dispatch(domainEvent)
    // or
    //DomainEvents.dispatchEventsForAggregate(user.id)
    // or
    //user.dispatchDomainEvents()
    //
  }

  /**
   * Validate DTO
   * @param signUpUserDTO
   * @private
   */
  private async validateDTO(signUpUserDTO: SignUpUserDTO) {
    const userName = UserName.create(signUpUserDTO.username)
    const userEmail = UserEmail.create(signUpUserDTO.email)
    const userCredential = await UserCredential.create(signUpUserDTO.password)
    const combinedResult = Result.combine([userName, userEmail, userCredential])

    return {
      isSuccess: combinedResult.isSuccess,
      error: combinedResult.isFailure ? combinedResult.errorValue() : '',
      userName: userName.isSuccess ? userName.getValue() : userName.errorValue(),
      userEmail: userEmail.isSuccess ? userEmail.getValue() : userEmail.errorValue(),
      userCredential: userCredential.isSuccess ? userCredential.getValue() : userCredential.errorValue(),
    }
  }

  /**
   * Execute the use case
   * @param signUpUserDTO
   */
  public async execute(signUpUserDTO: SignUpUserDTO): Promise<SignUpUserResponse> {
    try {
      // Validate DTO
      const validDTO = await this.validateDTO(signUpUserDTO)
      if (!validDTO.isSuccess) {
        return left(new SignUpUserErrors.ValidationError(validDTO.error)) as SignUpUserResponse
      }

      // Check if user already exist in database and validate conflicts
      let foundUser: User = <User>(
        await this.userRepo.exists(validDTO.userName.value, validDTO.userEmail.value)
      )
      if (foundUser) {
        if (foundUser.isDeleted) {
          return left(new SignUpUserErrors.UserIsMarkedForDeletion()) as SignUpUserResponse
        }

        if (foundUser.username.equals(validDTO.userName)) {
          return left(new SignUpUserErrors.UsernameTaken(validDTO.userName.value)) as SignUpUserResponse
        }

        if (foundUser.email.equals(validDTO.userEmail)) {
          return left(new SignUpUserErrors.EmailAlreadyExists(validDTO.userEmail.value)) as SignUpUserResponse
        }
      }

      // Create a new user entity
      const resultUser = User.create({
        username: validDTO.userName,
        email: validDTO.userEmail,
        credential: validDTO.userCredential,
      })
      if (!resultUser.isSuccess) {
        return left(Result.fail<User>(resultUser.error.toString())) as SignUpUserResponse
      }

      const user: User = resultUser.getValue()
      // Save user
      const isSaved = await this.userRepo.save(user)
      if (isSaved) {
        this.dispatchDomainEvent(user)
      } else {
        return left(new SignUpUserErrors.UnableToSaveUser(validDTO.userName.value)) as SignUpUserResponse
      }

      return right(Result.ok<void>())
    } catch (err) {
      return left(new AppError.UnexpectedError(err)) as SignUpUserResponse
    }
  }
}
