/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

//import { DecodedExpressRequest } from '../../infra/http/models/DecodedRequest'
import { AppError } from '../../../../core/common/AppError'
import { BaseController, Request, Response } from '../../../../core/infra/BaseController'

import { SignUpUser } from './SignUpUser'
import { SignUpUserDTO } from './SignUpUserDTO'
import { SignUpUserErrors } from './SignUpUserErrors'

/**
 * Use case controller
 * @class
 */
export class SignUpUserController extends BaseController {
  private useCase: SignUpUser

  /**
   * Creates a new controller instance
   * @param useCase The use case to execute
   */
  public constructor(useCase: SignUpUser) {
    super()
    this.useCase = useCase
  }

  /**
   * Execute the controller implementation
   * @param req
   * @param res
   */
  public async executeImpl(req: Request, res: Response): Promise<void | any> {
    let signUpUserDTO = req.body as SignUpUserDTO

    try {
      const result = await this.useCase.execute(signUpUserDTO)
      if (result.isLeft()) {
        const errorResult = result.value
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
        return this.ok(res)
      }
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
