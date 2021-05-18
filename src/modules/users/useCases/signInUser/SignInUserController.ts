/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { ServiceLogger } from '@hgc-sdk/logger'
import { AppError } from '../../../../core/common/AppError'
import { BaseController, Request, Response, NextFunction } from '../../../../core/infra/BaseController'

import { SignInUser } from './SignInUser'
import { SignInDTO } from './SignInUserDTO'
import { SignInUserErrors } from './SignInUserErrors'
import { User } from '../../domain/User'
import { JWT } from '../../service/authentication/jwt'

/**
 * Implements controller logic for the request/response
 * cycle when a user sign in.
 */
export class SignInUserController extends BaseController {
  private useCase: SignInUser
  private logger: ServiceLogger
  private jwt: JWT

  public constructor(useCase: SignInUser, logger: ServiceLogger, jwt: JWT) {
    super()
    this.useCase = useCase
    this.logger = logger
    this.jwt = jwt
  }

  private updateSession = (req: Request, user: User) => {
    req.session.user = {
      username: user.username.value,
      email: user.email.value,
      scope: user.scope.value,
      isEmailVerified: user.isEmailVerified,
      isAdminUser: user.isAdminUser
    }
  }

  public async executeImpl(req: Request, res: Response, next: NextFunction): Promise<void | any> {
    const { body } = req
    const signInDTO = {
      username: body.username,
      password: body.password
    } as SignInDTO

    this.logger.verbose('executeImpl: ', signInDTO.username)

    try {

      // Execute use case
      const result = await this.useCase.execute(signInDTO)

      if (result.isLeft()) {
        const errorResult = result.value
        switch (errorResult.constructor) {
          case SignInUserErrors.ValidationError:
            return this.badRequest(res, errorResult.errorValue().message)
          case SignInUserErrors.InvalidCredential:
            return this.badRequest(res, errorResult.errorValue().message)
          case SignInUserErrors.UserIsMarkedForDeletion:
            return this.conflict(res, errorResult.errorValue().message)
          case SignInUserErrors.NotAuthorized:
            return this.badRequest(res, errorResult.errorValue().message)
          case AppError.UnexpectedError:
            return this.fail(res, errorResult.errorValue().message)
          default:
            return this.fail(res, errorResult.errorValue().message)
        }
      } else {

        // Set user in express session
        this.updateSession(req, result.value.getValue())

        this.logger.verbose('executeImpl: ended gracefully')
        return this.ok(res)
      }
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
