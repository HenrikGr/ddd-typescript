/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { ServiceLogger } from '@hgc-sdk/logger'
import { AppError } from '../../../../core/common/AppError'
import { BaseController, Request, Response, NextFunction } from '../../../../core/infra/BaseController'

import { SignUp } from './SignUp'
import { SignUpDTO } from './SignUpDTO'
import { SignUpErrors } from './SignUpErrors'

/**
 * Implementation for the API request - response cycle
 */
export class SignUpController extends BaseController {
  /**
   * SignUp - use case
   * @private
   */
  private useCase: SignUp

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
  public constructor(useCase: SignUp, logger: ServiceLogger) {
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
    const signUpDTO = req.body as SignUpDTO
    this.logger.info('executeImpl - started: ', signUpDTO.username)

    try {

      const result = await this.useCase.execute(signUpDTO)
      if (result.isLeft()) {
        const errorResult = result.value
        this.logger.error('executeImpl: ', errorResult.errorValue())
        switch (errorResult.constructor) {
          case SignUpErrors.ValidationError:
            return this.badRequest(res, errorResult.errorValue().message)
          case SignUpErrors.UserIsMarkedForDeletion:
            return this.conflict(res, errorResult.errorValue().message)
          case SignUpErrors.UsernameTaken:
            return this.conflict(res, errorResult.errorValue().message)
          case SignUpErrors.EmailAlreadyExists:
            return this.conflict(res, errorResult.errorValue().message)
          case SignUpErrors.UnableToSaveUser:
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
