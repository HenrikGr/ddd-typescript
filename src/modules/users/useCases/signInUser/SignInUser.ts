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
import { SignInDTO, SignInResponseDTO } from './SignInUserDTO'
import { SignInUserErrors } from './SignInUserErrors'
import { SignInUserResponse } from './SignInUserResponses'

import { User } from '../../domain/User'
import { UserName } from '../../domain/userName'
import { UserCredential } from '../../domain/userCredential'
import { UserScope } from '../../domain/userScope'

import { UserDomainEvent } from '../../domain/events/UserDomainEvent'
import { IResourceOwner } from '../../service/OAuth/ResourceOwner'

/**
 * SignInUser
 * @class
 */
export class SignInUser implements UseCase<SignInDTO, Promise<SignInUserResponse>> {
  private userRepo: IUserRepo
  private oAuthService: IResourceOwner

  /**
   * Creates a new SignInUser instance
   * @param userRepo The user repository
   * @param oAuthService
   */
  constructor(userRepo: IUserRepo, oAuthService: IResourceOwner) {
    this.userRepo = userRepo
    this.oAuthService = oAuthService
  }

  /**
   * Validate DTO
   * @param signInDTO
   * @private
   */
  private validateDTO = async (signInDTO: SignInDTO) => {
    const userName = UserName.create(signInDTO.username)
    const userCredential = await UserCredential.create(signInDTO.password)
    const userScope = UserScope.create(signInDTO.scope)
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
   * @param signInDTO
   */
  public async execute(signInDTO: SignInDTO): Promise<SignInUserResponse> {

    try {

      // Validate DTO
      const validDTO = await this.validateDTO(signInDTO)
      if (!validDTO.isSuccess) {
        return left(new SignInUserErrors.ValidationError(validDTO.error)) as SignInUserResponse
      }

      // Check if user exist and perform validation
      const foundUser = <User>await this.userRepo.exists(signInDTO.username)
      if (!foundUser) {
        // Did not find username
        return left(new SignInUserErrors.InvalidCredential()) as SignInUserResponse
      }

      // Check password on found user
      if (!(await foundUser.credential.compare(signInDTO.password))) {
        return left(new SignInUserErrors.InvalidCredential()) as SignInUserResponse
      }

      // Check if account disabled
      if (foundUser.isDeleted) {
        return left(new SignInUserErrors.UserIsMarkedForDeletion()) as SignInUserResponse
      }

      // Authorize the user against the OAuth2 server
      let token = await this.oAuthService.getAccessToken(
        signInDTO.username,
        signInDTO.password,
        signInDTO.scope
      )

      if (!token) {
        return left(new SignInUserErrors.NotAuthorized()) as SignInUserResponse
      }

      return right(Result.ok<SignInResponseDTO>(token))
    } catch (err) {
      return left(new AppError.UnexpectedError(err)) as SignInUserResponse
    }
  }
}
