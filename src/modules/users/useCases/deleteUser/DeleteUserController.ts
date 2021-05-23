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
 * Implements controller logic for the request/response cycle
 */
export class DeleteUserController extends BaseController {

  /**
   * Delete User use case
   * @private
   */
  private useCase: DeleteUser

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
  public constructor(useCase: DeleteUser, logger: ServiceLogger) {
    super()
    this.useCase = useCase
    this.logger = logger
  }

  /**
   * Run the controller implementation
   * @param req
   * @param res
   */
  public async executeImpl(req: Request, res: Response): Promise<void | any> {
    const deleteUserDTO = {
      username: req.params.username,
      session: req.session
    } as DeleteUserDTO

    try {
      this.logger.info('executeImpl - started: ', deleteUserDTO.username)

      const result = await this.useCase.execute(deleteUserDTO)

      // Check if use case failed
      if (result.isLeft()) {
        const errorResult = result.value
        this.logger.error('executeImpl: ', errorResult.errorValue())
        switch (errorResult.constructor) {
          case DeleteUserErrors.NotAuthorized:
            return this.unauthorized(res, errorResult.errorValue().message)
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
            return this.fail(res, errorResult.error.message)
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
