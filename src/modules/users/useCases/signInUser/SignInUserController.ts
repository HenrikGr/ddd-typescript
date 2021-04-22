/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

//import { DecodedExpressRequest } from '../../infra/http/models/DecodedRequest'
import { AppError } from '../../../../core/common/AppError'
import { BaseController, Request, Response } from '../../../../core/infra/BaseController'

import { SignInUser } from './SignInUser'
import { SignInDTO, SignInResponseDTO } from './SignInUserDTO'
import { SignInUserErrors } from './SignInUserErrors'

/**
 * Use case controller
 */
export class SignInUserController extends BaseController {
  private useCase: SignInUser

  /**
   * Creates a new controller instance
   * @param useCase The use case to execute
   */
  public constructor(useCase: SignInUser) {
    super()
    this.useCase = useCase
  }

  /**
   * Execute the controller implementation
   * @param req
   * @param res
   */
  public async executeImpl(req: any, res: Response): Promise<void | any> {
    let signInDTO = req.body as SignInDTO
    console.log('session: ', req.session, req.user)

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

        const token = result.value.getValue() as SignInResponseDTO
        console.log('token', token)

        return this.ok<SignInResponseDTO>(res, token)
      }
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
