/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { Request, Response, NextFunction } from 'express'
export { Request, Response,NextFunction } from 'express'

/**
 * An abstract controller class providing interfaces to handle the API request - response cycle.
 */
export abstract class BaseController {

  /**
   * Abstract method implementation interface for sub classes
   * @param req
   * @param res
   * @param next
   * @protected
   */
  protected abstract executeImpl(req: Request, res: Response, next?: NextFunction): Promise<void | any>

  /**
   * Route handler that catch any uncaught error in the sub class implementation.
   * @param req
   * @param res
   * @param next
   */
  public async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        await this.executeImpl(req, res, next)
    } catch (err) {
      this.fail(res, 'An unexpected error occurred')
    }
  }

  /**
   * JSON response helper that respond with a customizable code and message
   * @param res The response object
   * @param code The code
   * @param message The response message
   */
  protected jsonResponse(res: Response, code: number, message: string): Response {
    return res.status(code).json({ message })
  }

  /**
   * Respond with status 200 - either with a dto or just an ok message
   * @param res
   * @param dto
   */
  public ok<T>(res: Response, dto?: T): Response {
    if (!!dto) {
      res.type('application/json')
      return res.status(200).json(dto)
    } else {
      return res.sendStatus(200)
    }
  }

  /**
   * Respond with status 500 and provided error object or string message
   * @param res The response object
   * @param error The error object or string
   */
  public fail(res: Response, error: Error | string): Response {
    if (error instanceof Error) {
      return res.status(500).json({
        message: error.toString(),
      })
    }

    return res.status(500).json({
      message: error,
    })
  }

  /**
   * Respond with status 201
   * @param res The response object
   */
  public created(res: Response): Response {
    return res.sendStatus(201)
  }

  /**
   * Respond with status 400 - Bad Request
   * @param res The response object
   * @param message The optional message to override default
   */
  public badRequest(res: Response, message?: string): Response {
    return this.jsonResponse(res, 400, message ? message : 'BadRequest')
  }

  /**
   * Respond with status 410 - Unauthorized
   * @param res The response object
   * @param message The optional message to override default
   */
  public unauthorized(res: Response, message?: string): Response {
    return this.jsonResponse(res, 401, message ? message : 'Unauthorized')
  }

  /**
   * Respond with status 402 - Payment required
   * @param res The response object
   * @param message The optional message to override default
   */
  public paymentRequired(res: Response, message?: string): Response {
    return this.jsonResponse(res, 402, message ? message : 'Payment required')
  }

  /**
   * Respond with status 403 - Forbidden
   * @param res The response object
   * @param message The optional message to override default
   */
  public forbidden(res: Response, message?: string): Response {
    return this.jsonResponse(res, 403, message ? message : 'Forbidden')
  }

  /**
   * Respond with status 404 - Not found
   * @param res The response object
   * @param message The optional message to override default
   */
  public notFound(res: Response, message?: string): Response {
    return this.jsonResponse(res, 404, message ? message : 'Not found')
  }

  /**
   * Respond with status 409 - Conflict
   * @param res
   * @param message
   */
  public conflict(res: Response, message?: string): Response {
    return this.jsonResponse(res, 409, message ? message : 'Conflict')
  }

  /**
   * Respond with status 429 - To many requests
   * @param res
   * @param message
   */
  public tooMany(res: Response, message?: string): Response {
    return this.jsonResponse(res, 429, message ? message : 'Too many requests')
  }
}
