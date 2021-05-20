/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { JWT, IDToken } from './jwt/JWT'
import { IDTokenClaims } from './jwt/IClaims'
import { User } from '../../domain/User'
import { NextFunction, Request, Response } from 'express'
import { ServiceLogger } from '@hgc-sdk/logger'

export interface IAuthenticationService {
  createIDToken(user: User): IDToken
}


export class AuthenticationService {
  private jwt: JWT
  private logger: ServiceLogger

  constructor(jwt: JWT, logger: ServiceLogger) {
    this.jwt = jwt
    this.logger = logger
  }

  public createIDToken(user: User): IDToken {
    return this.jwt.createIDToken(user)

  }

  public decodeIdToken(token: IDToken): IDTokenClaims {
    return this.jwt.verifyToken(token)
  }

  public isAuthenticated(req: Request, res: Response, next: NextFunction): void {
    if (!(req.session && req.session.user)) {
      this.logger.verbose('ensureAuthenticated: NO user session found - redirecting')
      return res.redirect('/api/v1/users/signin')
    }

    this.logger.verbose(`ensureAuthenticated: ${req.session.user.username} is logged in`)
    next()
  }

  private extractToken = (req: Request) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1]
    } else if (req.query && req.query.token) {
      return req.query.token
    }
    return null
  }


  public isAuthorized(req: Request, res: Response, next: NextFunction): void {
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
