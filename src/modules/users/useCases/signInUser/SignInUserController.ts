/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { ServiceLogger } from '@hgc-sdk/logger'
import { AppError } from '../../../../core/common/AppError'
import { BaseController, Request, Response } from '../../../../core/infra/BaseController'

import { SignInUser } from './SignInUser'
import { SignInDTO, SignInResponseDTO } from './SignInUserDTO'
import { SignInUserErrors } from './SignInUserErrors'

/**
 * Sign in user controller
 */
export class SignInUserController extends BaseController {
  private useCase: SignInUser
  private logger: ServiceLogger

  /**
   * Creates a new controller instance
   * @param useCase The use case to execute
   * @param logger
   */
  public constructor(useCase: SignInUser, logger: ServiceLogger) {
    super()
    this.useCase = useCase
    this.logger = logger
  }

  /**
   * Execute the controller implementation
   * @param req
   * @param res
   */
  public async executeImpl(req: Request, res: Response): Promise<void | any> {
    this.logger.verbose('SingInUserController session: ', req.session)
    let signInDTO = req.body as SignInDTO

    try {
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
        const response = result.value.getValue() as SignInResponseDTO

        // Set user in express session
        req.session.user = { id: response.user.id.value }
        delete response.user
        return this.ok<SignInResponseDTO>(res, response)
      }
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
