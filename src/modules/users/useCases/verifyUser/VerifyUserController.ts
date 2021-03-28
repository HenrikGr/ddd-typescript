/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

//import { DecodedExpressRequest } from '../../infra/http/models/DecodedRequest'
import * as express from 'express'
import { BaseController } from '../../../../core/infra/BaseController'

/**
 * Implements controller logic for the use case - create user
 */
export class VerifyUserController extends BaseController {
  private useCase: any
  constructor(useCase: any) {
    super();
    this.useCase = useCase
  }

  public async executeImpl(req: express.Request, res: express.Response): Promise<void | any> {
    let dto = req.body as any

    try {

      const result = await this.useCase.execute(dto)
      if (result.isLeft()) {
        const errorResult = result.value
        switch (errorResult.constructor) {
          /*
          case CreateUserErrors.UsernameTaken:
            return this.conflict(res, errorResult.errorValue().message)
          case CreateUserErrors.EmailAlreadyExists:
            return this.conflict(res, errorResult.errorValue().message)
          case CreateUserErrors.EmailAndUserNameAlreadyExists:
            return this.conflict(res, errorResult.errorValue().message)
          case CreateUserErrors.ClientError:
            return this.clientError(res, errorResult.errorValue().message)
          default:
            return this.fail(res, errorResult.errorValue())

           */
        }
      } else {
        return this.ok(res)
      }
    } catch (err) {
      return this.fail(res, err)
    }

  }
}
