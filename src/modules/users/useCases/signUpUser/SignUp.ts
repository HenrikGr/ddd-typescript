/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { ServiceLogger } from '@hgc-sdk/logger'
import { AppError } from '../../../../core/common/AppError'
import { Result, left, right, Either } from '../../../../core/common/Result'

import { IUseCase } from '../../../../core/domain/UseCase'

import { IUserRepo } from '../../repos/userRepo'
import { SignUpDTO } from './SignUpDTO'
import { SignUpErrors } from './SignUpErrors'

import { User } from '../../domain/User'
import { UserName } from '../../domain/userName'
import { UserEmail } from '../../domain/userEmail'
import { UserCredential } from '../../domain/userCredential'
import { UserScope } from '../../domain/userScope'

/**
 * Use case response
 */
export type UseCaseResponse = Either<
  | SignUpErrors.ValidationError
  | SignUpErrors.UserIsMarkedForDeletion
  | SignUpErrors.EmailAlreadyExists
  | SignUpErrors.UsernameTaken
  | SignUpErrors.UnableToSaveUser
  | AppError.UnexpectedError
  | Result<any>,
  Result<void>
>

/**
 * Implementation of the use case - SignUp
 */
export class SignUp implements IUseCase<SignUpDTO, Promise<UseCaseResponse>> {
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
   * Validate the SignUpDTO
   * @param signUpDTO
   */
  private validateSignUpDTO = async (signUpDTO: SignUpDTO) => {
    const userName = UserName.create(signUpDTO.username)
    const userEmail = UserEmail.create(signUpDTO.email)
    const userCredential = await UserCredential.create(signUpDTO.password)
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
   * @param signUpDTO
   */
  public async execute(signUpDTO: SignUpDTO): Promise<UseCaseResponse> {
    this.logger.info('execute - started ', signUpDTO.username)

    try {
      /**
       * Validate the SignUpDTO
       */
      const validDTO = await this.validateSignUpDTO(signUpDTO)
      if (!validDTO.isSuccess) {
        return left(new SignUpErrors.ValidationError(validDTO.error)) as UseCaseResponse
      }

      /**
       * Check if user exist in database and perform som validation
       */
      const foundUser = <User>await this.userRepo.exists(validDTO.userName.value, validDTO.userEmail.value)
      if (foundUser) {
        /**
         * Chek if existing user is marked for deletion
         */
        if (foundUser.isDeleted) {
          return left(new SignUpErrors.UserIsMarkedForDeletion()) as UseCaseResponse
        }

        /**
         * Validate existing user's username
         */
        if (foundUser.username.equals(validDTO.userName)) {
          return left(new SignUpErrors.UsernameTaken(validDTO.userName.value)) as UseCaseResponse
        }

        /**
         * Check existing user's email address
         */
        if (foundUser.email.equals(validDTO.userEmail)) {
          return left(new SignUpErrors.EmailAlreadyExists(validDTO.userEmail.value)) as UseCaseResponse
        }
      }

      /**
       * Try creating a new user entity object
       */
      const resultUser = User.create({
        username: validDTO.userName,
        email: validDTO.userEmail,
        credential: validDTO.userCredential,
        scope: UserScope.create('profile').getValue(),
        isDeleted: false,
        isEmailVerified: false,
        isAdminUser: true,
      })

      // Failed creating a user entity object
      if (resultUser.isFailure) {
        return left(Result.fail<User>(resultUser.error.toString())) as UseCaseResponse
      }

      // Get the user entity object
      const user: User = resultUser.getValue()

      /**
       * Save the user to the database
       */
      const isSaved = await this.userRepo.save(user)
      if (!isSaved) {
        return left(new SignUpErrors.UnableToSaveUser(validDTO.userName.value)) as UseCaseResponse
      } else {
        /**
         * If user is saved to the database - dispatch a domain event
         */
        user.dispatchDomainEvents()
      }

      /**
       * Return use case
       */
      this.logger.info('execute - ended gracefully')
      return right(Result.ok<void>())
    } catch (err) {
      this.logger.error('execute: ', err.message)
      return left(new AppError.UnexpectedError(err)) as UseCaseResponse
    }
  }
}
