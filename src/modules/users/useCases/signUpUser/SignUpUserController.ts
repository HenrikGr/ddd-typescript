/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { AppError } from '../../../../core/common/AppError'
import { BaseController, Request, Response, NextFunction } from '../../../../core/infra/BaseController'

import { SignUpUser } from './SignUpUser'
import { SignUpUserDTO } from './SignUpUserDTO'
import { SignUpUserErrors } from './SignUpUserErrors'

/**
 * Controller for SignUp use case
 */
export class SignUpUserController extends BaseController {
  private useCase: SignUpUser

  public constructor(useCase: SignUpUser) {
    super()
    this.useCase = useCase
  }

  public async executeImpl(req: Request, res: Response, next: NextFunction): Promise<void | any> {
    const signUpUserDTO = req.body as SignUpUserDTO

    try {

      // Run use case implementation
      const result = await this.useCase.execute(signUpUserDTO)

      // If use case failed
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
        // use case was successful
        return this.ok(res)
      }
    } catch (err) {
      // Unexpected error
      return this.fail(res, err)
    }
  }
}
