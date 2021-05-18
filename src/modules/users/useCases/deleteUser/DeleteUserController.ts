/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { ServiceLogger } from '@hgc-sdk/logger'
import { AppError } from '../../../../core/common/AppError'
import { BaseController, Request, Response } from '../../../../core/infra/BaseController'

import { DeleteUser } from './DeleteUser'
import { DeleteUserDTO } from './DeleteUserDTO'
import { DeleteUserErrors } from './DeleteUserErrors'

/**
 * Implements controller logic for the request/response
 * cycle when deleting a user.
 */
export class DeleteUserController extends BaseController {
  private useCase: DeleteUser
  private logger: ServiceLogger

  public constructor(useCase: DeleteUser, logger: ServiceLogger) {
    super()
    this.useCase = useCase
    this.logger = logger
  }

  public async executeImpl(req: Request, res: Response): Promise<void | any> {
    const deleteUserDTO = req.params as DeleteUserDTO
    const session = req.session

    this.logger.verbose('deleteUserDTO: ', deleteUserDTO)
    this.logger.verbose('session: ', session)

    try {
      const result = await this.useCase.execute(deleteUserDTO)
      if (result.isLeft()) {
        const errorResult = result.value
        switch (errorResult.constructor) {
          case DeleteUserErrors.ValidationError:
            return this.badRequest(res, errorResult.errorValue().message)
          case DeleteUserErrors.UserNotFound:
            return this.conflict(res, errorResult.errorValue().message)
          case DeleteUserErrors.UserIsMarkedForDeletion:
            return this.conflict(res, errorResult.errorValue().message)
          case DeleteUserErrors.UnableToDeleteUser:
            return this.fail(res, errorResult.errorValue().message)
          case AppError.UnexpectedError:
            return this.fail(res, errorResult.error.message)
          default:
            return this.fail(res, errorResult.errorValue())
        }
      } else {
        return this.ok(res)
      }
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
