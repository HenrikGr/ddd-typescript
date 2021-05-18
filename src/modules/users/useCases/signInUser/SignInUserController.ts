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

/**
 * Implements controller logic for the request/response
 * cycle when a user sign in.
 */
export class SignInUserController extends BaseController {
  private useCase: SignInUser
  private logger: ServiceLogger

  public constructor(useCase: SignInUser, logger: ServiceLogger) {
    super()
    this.useCase = useCase
    this.logger = logger
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

        const userValue = result.value.getValue()

        // Set user in express session
        req.session.user = {
          username: userValue.username.value,
          email: userValue.email.value,
          scope: userValue.scope.value,
          isEmailVerified: userValue.isEmailVerified,
          isAdminUser: userValue.isAdminUser
        }

        this.logger.verbose('executeImpl: ended gracefully')
        return this.ok(res)
      }
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
