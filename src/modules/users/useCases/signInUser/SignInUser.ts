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
import { SignInDTO } from './SignInUserDTO'
import { SignInUserErrors } from './SignInUserErrors'

import { User } from '../../domain/User'
import { UserName } from '../../domain/userName'
import { UserCredential } from '../../domain/userCredential'

/**
 * Use case response
 */
type UseCaseResponse = Either<
  | SignInUserErrors.ValidationError
  | SignInUserErrors.InvalidCredential
  | SignInUserErrors.UserIsMarkedForDeletion
  | SignInUserErrors.NotAuthorized
  | AppError.UnexpectedError,
  Result<User>
>

/**
 * Implementation of the SignInUser use case
 */
export class SignInUser implements UseCase<SignInDTO, Promise<UseCaseResponse>> {
  private userRepo: IUserRepo
  private logger: ServiceLogger

  constructor(userRepo: IUserRepo, logger: ServiceLogger) {
    this.userRepo = userRepo
    this.logger = logger
  }

  private validateDTO = async (signInDTO: SignInDTO) => {
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
   * Execute the use case
   * @param signInDTO
   */
  public async execute(signInDTO: SignInDTO): Promise<UseCaseResponse> {
    this.logger.verbose('execute: ', signInDTO.username)

    try {
      // Validate DTO
      const validDTO = await this.validateDTO(signInDTO)
      if (!validDTO.isSuccess) {
        return left(new SignInUserErrors.ValidationError(validDTO.error)) as UseCaseResponse
      }

      // Check if username exist
      const foundUser = <User>await this.userRepo.exists(signInDTO.username)
      if (!foundUser) {
        // Did not find username
        return left(new SignInUserErrors.InvalidCredential()) as UseCaseResponse
      }

      // Check password on found user
      if (!(await foundUser.credential.compare(signInDTO.password))) {
        return left(new SignInUserErrors.InvalidCredential()) as UseCaseResponse
      }

      // Check if account disabled
      if (foundUser.isDeleted) {
        return left(new SignInUserErrors.UserIsMarkedForDeletion()) as UseCaseResponse
      }

      this.logger.verbose('execute: ended gracefully')
      return right(Result.ok<User>(foundUser)) as UseCaseResponse
    } catch (err) {
      return left(new AppError.UnexpectedError(err)) as UseCaseResponse
    }
  }
}
