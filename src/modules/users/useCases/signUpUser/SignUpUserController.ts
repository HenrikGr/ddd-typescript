/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { ServiceLogger } from '@hgc-sdk/logger'
import { AppError } from '../../../../core/common/AppError'
import { BaseController, Request, Response, NextFunction } from '../../../../core/infra/BaseController'

import { SignUpUser } from './SignUpUser'
import { SignUpUserDTO } from './SignUpUserDTO'
import { SignUpUserErrors } from './SignUpUserErrors'

/**
 * Implements controller logic for the request/response cycle
 */
export class SignUpUserController extends BaseController {

  /**
   * SignUp user use case
   * @private
   */
  private useCase: SignUpUser

  /**
   * Controller logger
   * @private
   */
  private logger: ServiceLogger

  /**
   * Create a new controller instance
   * @param useCase
   * @param logger
   */
  public constructor(useCase: SignUpUser, logger: ServiceLogger) {
    super()
    this.useCase = useCase
    this.logger = logger
  }

  /**
   * Run the controller implementation
   * @param req
   * @param res
   * @param next
   */
  public async executeImpl(req: Request, res: Response, next: NextFunction): Promise<void | any> {
    const signUpUserDTO = req.body as SignUpUserDTO

    try {
      this.logger.info('executeImpl - started: ', signUpUserDTO.username)

      const result = await this.useCase.execute(signUpUserDTO)

      // Check if use case failed
      if (result.isLeft()) {
        const errorResult = result.value
        this.logger.error('executeImpl: ', errorResult.errorValue())
        switch (errorResult.constructor) {
          case SignUpUserErrors.ValidationError:
            return this.badRequest(res, errorResult.errorValue().message)
          case SignUpUserErrors.UserIsMarkedForDeletion:
            return this.conflict(res, errorResult.errorValue().message)
          case SignUpUserErrors.UsernameTaken:
            return this.conflict(res, errorResult.errorValue().message)
          case SignUpUserErrors.EmailAlreadyExists:
            return this.conflict(res, errorResult.errorValue().message)
          case SignUpUserErrors.UnableToSaveUser:
            return this.fail(res, errorResult.errorValue().message)
          case AppError.UnexpectedError:
            return this.fail(res, errorResult.errorValue().message)
          default:
            return this.fail(res, errorResult.error.error)
        }
      } else {
        this.logger.info('executeImpl - ended gracefully')
        return this.ok(res)
      }
    } catch (err) {
      this.logger.error('executeImpl: ', err.message)
      return this.fail(res, err)
    }
  }
}
