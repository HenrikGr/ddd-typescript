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
import { SignUpUserDTO } from './SignUpUserDTO'
import { SignUpUserErrors } from './SignUpUserErrors'

import { User } from '../../domain/User'
import { UserName } from '../../domain/userName'
import { UserEmail } from '../../domain/userEmail'
import { UserCredential } from '../../domain/userCredential'
import { UserScope } from '../../domain/userScope'

/**
 * Use case response
 */
export type UseCaseResponse = Either<
  | SignUpUserErrors.ValidationError
  | SignUpUserErrors.UserIsMarkedForDeletion
  | SignUpUserErrors.EmailAlreadyExists
  | SignUpUserErrors.UsernameTaken
  | SignUpUserErrors.UnableToSaveUser
  | AppError.UnexpectedError
  | Result<any>,
  Result<void>
>

/**
 * Implementation of the SignUpUser use case
 */
export class SignUpUser implements UseCase<SignUpUserDTO, Promise<UseCaseResponse>> {
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
   * Validate DTO
   * @param signUpUserDTO
   */
  private validateDTO = async (signUpUserDTO: SignUpUserDTO) => {
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
   * Run the use case implementation
   * @param signUpUserDTO
   */
  public async execute(signUpUserDTO: SignUpUserDTO): Promise<UseCaseResponse> {
    this.logger.info('execute - started ', signUpUserDTO.username)

    try {
      // Validate DTO
      const validDTO = await this.validateDTO(signUpUserDTO)
      if (!validDTO.isSuccess) {
        return left(new SignUpUserErrors.ValidationError(validDTO.error)) as UseCaseResponse
      }

      // The exist method checks if username or email address exists
      let foundUser: User = <User>(
        await this.userRepo.exists(validDTO.userName.value, validDTO.userEmail.value)
      )
      if (foundUser) {
        if (foundUser.isDeleted) {
          return left(new SignUpUserErrors.UserIsMarkedForDeletion()) as UseCaseResponse
        }

        if (foundUser.username.equals(validDTO.userName)) {
          return left(new SignUpUserErrors.UsernameTaken(validDTO.userName.value)) as UseCaseResponse
        }

        if (foundUser.email.equals(validDTO.userEmail)) {
          return left(new SignUpUserErrors.EmailAlreadyExists(validDTO.userEmail.value)) as UseCaseResponse
        }
      }

      // User was not found - create the new user entity
      const resultUser = User.create({
        username: validDTO.userName,
        email: validDTO.userEmail,
        credential: validDTO.userCredential,
        scope: UserScope.create('profile').getValue(),
        isDeleted: false,
        isEmailVerified: false,
        isAdminUser: true,
      })

      if (resultUser.isFailure) {
        return left(Result.fail<User>(resultUser.error.toString())) as UseCaseResponse
      }

      const user: User = resultUser.getValue()

      // Save user
      const isSaved = await this.userRepo.save(user)
      if (!isSaved) {
        return left(new SignUpUserErrors.UnableToSaveUser(validDTO.userName.value)) as UseCaseResponse
      } else {
        // User is persisted and it is safe to dispatch domain events in the aggregate root (User)
        //user.dispatchDomainEvents()
      }

      this.logger.info('execute - ended gracefully')
      return right(Result.ok<void>())
    } catch (err) {
      return left(new AppError.UnexpectedError(err)) as UseCaseResponse
    }
  }
}
