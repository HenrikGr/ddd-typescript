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
import { SignInDTO } from './SignInDTO'
import { SignInErrors } from './SignInErrors'

import { User } from '../../domain/User'
import { UserName } from '../../domain/userName'
import { UserCredential } from '../../domain/userCredential'

/**
 * Use case response
 */
type UseCaseResponse = Either<
  | SignInErrors.ValidationError
  | SignInErrors.InvalidCredential
  | SignInErrors.UserIsMarkedForDeletion
  | SignInErrors.NotAuthorized
  | AppError.UnexpectedError,
  Result<User>
>

/**
 * Implementation of the use case - SignIn
 */
export class SignIn implements IUseCase<SignInDTO, Promise<UseCaseResponse>> {
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
   * Creates a new use case instance
   * @param userRepo
   * @param logger
   */
  constructor(userRepo: IUserRepo, logger: ServiceLogger) {
    this.userRepo = userRepo
    this.logger = logger
  }

  /**
   * Validate the SignInDTO
   * @param signInDTO
   */
  private validateSignInDTO = async (signInDTO: SignInDTO) => {
    const userName = UserName.create(signInDTO.username)
    const userCredential = await UserCredential.create(signInDTO.password)
    const combinedResult = Result.combine([userName, userCredential])

    return {
      isSuccess: combinedResult.isSuccess,
      error: combinedResult.isFailure ? combinedResult.errorValue() : '',
      userName: userName.isSuccess ? userName.getValue() : userName.errorValue(),
      userCredential: userCredential.isSuccess ? userCredential.getValue() : userCredential.errorValue(),
    }
  }

  /**
   * Run the use case implementation
   * @param signInDTO
   */
  public async execute(signInDTO: SignInDTO): Promise<UseCaseResponse> {
    this.logger.info('execute - started: ', signInDTO.username)

    try {
      /**
       * Validate the SignInDTO
       */
      const validDTO = await this.validateSignInDTO(signInDTO)
      if (!validDTO.isSuccess) {
        return left(new SignInErrors.ValidationError(validDTO.error)) as UseCaseResponse
      }

      /**
       * Check if user exist in database
       */
      const foundUser = (await this.userRepo.exists(signInDTO.username)) as User
      if (!foundUser) {
        return left(new SignInErrors.InvalidCredential()) as UseCaseResponse
      }

      /**
       * Validate password
       */
      if (!(await foundUser.credential.compare(signInDTO.password))) {
        return left(new SignInErrors.InvalidCredential()) as UseCaseResponse
      }

      /**
       * Check if existing user is marked for deletion
       */
      if (foundUser.isDeleted) {
        return left(new SignInErrors.UserIsMarkedForDeletion()) as UseCaseResponse
      }

      /**
       * Return the existing user entity
       */
      this.logger.info('execute - ended gracefully')
      return right(Result.ok<User>(foundUser)) as UseCaseResponse
    } catch (err) {
      this.logger.error('execute: ', err.message)
      return left(new AppError.UnexpectedError(err)) as UseCaseResponse
    }
  }
}
