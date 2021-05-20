/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { NextFunction, Request, Response } from 'express'
import { ServiceLogger } from '@hgc-sdk/logger'
import { IAuthorizationService } from '../../../service/authorization/IAuthorizationService'

/**
 * User resource middleware
 */
export class UserMiddleware {
  private logger: ServiceLogger
  private oauthService: IAuthorizationService
  constructor(logger: ServiceLogger, oauthService: IAuthorizationService) {
    this.logger = logger
    this.oauthService = oauthService
  }

  private extractToken = (req: Request) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1]
    } else if (req.query && req.query.token) {
      return req.query.token
    }
    return null
  }

  /**
   * Ensure user logged in - session should contain user object
   * If not - redirect to signin url
   * @param req
   * @param res
   * @param next
   */
  public ensureAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (!(req.session && req.session.user)) {
      this.logger.verbose('ensureAuthenticated: NO user session found - redirecting')
      return res.redirect('/api/v1/users/signin')
    }

    this.logger.verbose(`ensureAuthenticated: ${req.session.user.username} is logged in`)
    next()
  }

  public isAuthorized = (req: Request, res: Response, next: NextFunction) => {
    const token = this.extractToken(req)
    if(!token) {
      this.logger.verbose('No Authorization token')
    } else {
      this.logger.verbose('Authorization token exist', token)
      this.logger.verbose('')

    }

    next()
  }
}
