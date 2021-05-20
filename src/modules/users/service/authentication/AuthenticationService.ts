/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { JWT, IDToken, IDTokenClaims, IProfileClaims, IEmailClaims } from './jwt/JWT'
import { User } from '../../domain/User'
import { NextFunction, Request, Response } from 'express'
import { ServiceLogger } from '@hgc-sdk/logger'

export interface IAuthenticationService {
  createIDToken(user: User): IDToken
}


export class AuthenticationService {
  private jwt: JWT
  private readonly idTokenLifeTime: number
  private logger: ServiceLogger

  constructor(jwt: JWT, logger: ServiceLogger) {
    this.jwt = jwt
    this.idTokenLifeTime = 60 * 60 * 10 // 10 hour
    this.logger = logger
  }

  private scopeMatch(scope: string, targetScope: string): string | undefined {
    return scope.split(' ').find((s) => s === targetScope)
  }

  public createIDToken(user: User): IDToken {
    this.logger.verbose('createIDToken: ', user.username.value, user.scope.value)
    const scope = user.scope.value
    const idTokenClaims: IDTokenClaims = {
      exp: Math.floor(Date.now() / 1000) + this.idTokenLifeTime,
      sub: user.id.toString(),
      scope: scope,
    }

    const emailClaims: IEmailClaims = this.scopeMatch(scope, 'email')
      ? { email: 'hgc-ab@outlook.com', email_verified: false }
      : {}
    this.logger.verbose('emailClaims: ', emailClaims)

    const profileClaims: IProfileClaims = this.scopeMatch(scope, 'profile')
      ? { name: 'Name', nickname: 'nickName' }
      : {}
    this.logger.verbose('profileClaims: ', profileClaims)

    const claims: IDTokenClaims = {
      ...idTokenClaims,
      ...emailClaims,
      ...profileClaims,
    }

    return this.jwt.createIDToken(claims)

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
