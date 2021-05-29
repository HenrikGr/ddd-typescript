/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { ServiceLogger } from '@hgc-sdk/logger'
import { AppError } from '../../../../core/common/AppError'
import { BaseController, Request, Response, NextFunction } from '../../../../core/infra/BaseController'

import { SignIn } from './SignIn'
import { SignInDTO } from './SignInDTO'
import { SignInErrors } from './SignInErrors'
import { User } from '../../domain/User'

/**
 * Implementation for the API request - response cycle
 */
export class SignInController extends BaseController {
  /**
   * SignIn - use case
   * @private
   */
  private useCase: SignIn

  /**
   * Controller logger
   * @private
   */
  private logger: ServiceLogger

  /**
   * Creates a new controller instance
   * @param useCase
   * @param logger
   */
  public constructor(useCase: SignIn, logger: ServiceLogger) {
    super()
    this.useCase = useCase
    this.logger = logger
  }

  /**
   * Update session with the singed in user
   * @param req
   * @param user
   */
  private updateSession = (req: Request, user: User) => {
    this.logger.info('updateSession: ', user.username.value)
    req.session.user = {
      username: user.username.value,
      email: user.email.value,
      scope: user.scope.value,
      isEmailVerified: user.isEmailVerified,
      isAdminUser: user.isAdminUser,
    }
  }

  /**
   * Run the controller implementation
   * @param req
   * @param res
   * @param next
   */
  public async executeImpl(req: Request, res: Response, next: NextFunction): Promise<void | any> {
    const signInDTO = req.body as SignInDTO
    this.logger.info('executeImpl - started: ', signInDTO.username)

    try {

      const result = await this.useCase.execute(signInDTO)

      if (result.isLeft()) {
        const errorResult = result.value
        this.logger.error('executeImpl: ', errorResult.error)
        switch (errorResult.constructor) {
          case SignInErrors.ValidationError:
            return this.badRequest(res, errorResult.errorValue().message)
          case SignInErrors.InvalidCredential:
            return this.badRequest(res, errorResult.errorValue().message)
          case SignInErrors.UserIsMarkedForDeletion:
            return this.conflict(res, errorResult.errorValue().message)
          case SignInErrors.NotAuthorized:
            return this.badRequest(res, errorResult.errorValue().message)
          case AppError.UnexpectedError:
            return this.fail(res, errorResult.errorValue().message)
          default:
            return this.fail(res, errorResult.errorValue().message)
        }
      } else {
        this.updateSession(req, result.value.getValue())
        this.logger.info('executeImpl - ended gracefully')
        return this.ok(res)
      }
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
