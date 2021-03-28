/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { AppError } from '../../../../core/common/AppError'
import { Result, left, right } from '../../../../core/common/Result'

import { DomainEvents } from '../../../../core/domain/events/DomainEvents'
import { UseCase } from '../../../../core/domain/UseCase'

import { IUserRepo } from '../../repos/userRepo'
import { SignInUserDTO, ISignInUserResponseDTO } from './SignInUserDTO'
import { SignInUserErrors } from './SignInUserErrors'
import { SignInUserResponse } from './SignInUserResponses'

import { User } from '../../domain/User'
import { UserName } from '../../domain/userName'
import { UserCredential } from '../../domain/userCredential'
import { UserScope } from '../../domain/userScope'

import { UserDomainEvent } from '../../domain/events/UserDomainEvent'
import { IAuthorizationService } from '../../service/authorization/AuthorizationService'

/**
 * SignInUser
 * @class
 */
export class SignInUser implements UseCase<SignInUserDTO, Promise<SignInUserResponse>> {
  private userRepo: IUserRepo
  private authorizationService: any

  /**
   * Creates a new SignInUser instance
   * @param userRepo The user repository
   * @param authorizationService
   */
  constructor(userRepo: IUserRepo, authorizationService: IAuthorizationService) {
    this.userRepo = userRepo
    this.authorizationService = authorizationService
  }

  /**
   * Validate DTO
   * @param signInUserDTO
   * @private
   */
  private async validateDTO(signInUserDTO: SignInUserDTO) {
    const userName = UserName.create(signInUserDTO.username)
    const userCredential = await UserCredential.create(signInUserDTO.password)
    const userScope = UserScope.create(signInUserDTO.scope)

    const combinedResult = Result.combine([userName, userCredential, userScope])

    return {
      isSuccess: combinedResult.isSuccess,
      error: combinedResult.isFailure ? combinedResult.errorValue() : '',
      userName: userName.isSuccess ? userName.getValue() : userName.errorValue(),
      userCredential: userCredential.isSuccess ? userCredential.getValue() : userCredential.errorValue(),
      userScope: userScope.isSuccess ? userScope.getValue() : userScope.errorValue(),
    }
  }


  /**
   * Execute the use case
   * @param signInUserDTO
   */
  public async execute(signInUserDTO: SignInUserDTO): Promise<SignInUserResponse> {

    try {

      // Validate DTO
      const validDTO = await this.validateDTO(signInUserDTO)
      if (!validDTO.isSuccess) {
        return left(new SignInUserErrors.ValidationError(validDTO.error)) as SignInUserResponse
      }

      // Check if user exist and perform validation
      // TODO: Should be included in authServices
      const foundUser = <User>await this.userRepo.exists(signInUserDTO.username)
      if (!foundUser) {
        return left(new SignInUserErrors.InvalidCredential()) as SignInUserResponse
      } else {
        if (!(await foundUser.credential.compare(signInUserDTO.password))) {
          return left(new SignInUserErrors.InvalidCredential()) as SignInUserResponse
        }

        if (foundUser.isDeleted) {
          return left(new SignInUserErrors.UserIsMarkedForDeletion()) as SignInUserResponse
        }
      }

      let token = await this.authorizationService.getAuthorizationToken(
        signInUserDTO.username,
        signInUserDTO.password,
        signInUserDTO.scope
      )

      if (!token) {
        return left(new SignInUserErrors.NotAuthorized()) as SignInUserResponse
      }

      return right(Result.ok<ISignInUserResponseDTO>(token))
    } catch (err) {
      return left(new AppError.UnexpectedError(err)) as SignInUserResponse
    }
  }
}
