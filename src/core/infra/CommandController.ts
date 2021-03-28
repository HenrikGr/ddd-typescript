/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { BaseController } from './BaseController'
import { Request, Response } from 'express'

/**
 * This principle is called Command–Query Separation(CQS). When possible, methods should
 * be separated into Commands (state-changing operations) and Queries (data-retrieval operations).
 * To make a clear distinction between those two types of operations, input objects can be
 * represented as Commands and Queries. Before DTO reaches the domain, it is converted into a
 * Command/Query object.
 */
export abstract class CommandController extends BaseController {

  /**
   * Abstract method implementation interface for sub classes
   * @param req The request object
   * @param res The response object
   */
  protected abstract executeCommand(req: Request, res: Response): Promise<void | any>

  /**
   * Execute the subclass controller implementation
   * @param req
   * @param res
   */
  public async executeImpl(req: Request, res: Response): Promise<void | any> {
    try {

      // Execute the subclass controller implementation
      await this.executeCommand(req, res)

    } catch (err) {
      console.log(`[CommandController]: Uncaught controller error`, err)
      this.fail(res, 'An unexpected error occurred')
    }

  }
}
