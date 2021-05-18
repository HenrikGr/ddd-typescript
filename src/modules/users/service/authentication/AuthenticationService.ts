/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { JWT } from './jwt/JWT'
import { IDTokenClaims, IEmailClaims, IProfileClaims } from './jwt/IClaims'
import { User } from '../../domain/User'

export type IDToken = string

export interface IAuthenticationService {
  createIDToken(user: User): IDToken
  verifyIDToken(token: IDToken): IDTokenClaims
  //createRefreshToken (): RefreshToken;
  //getTokens (username: string): Promise<string[]>;
  //saveAuthenticatedUser (user: User): Promise<void>;
  //deAuthenticateUser(username: string): Promise<void>;
  //refreshTokenExists (refreshToken: RefreshToken): Promise<boolean>;
  //getUserNameFromRefreshToken (refreshToken: RefreshToken): Promise<string>;
}

export class AuthenticationService implements IAuthenticationService {
  private readonly exp: number
  private jwt: JWT

  constructor(jwt: JWT) {
    this.exp = Math.floor(Date.now() / 1000) + 60 * 60 * 10 // Default 10 hour
    this.jwt = jwt
  }

  private scopeMatch(scope: string, targetScope: string) {
    if (scope === '') {
      return false
    }

    return scope.split(' ').every((s) => s === targetScope)
  }

  createIDToken(user: User): IDToken {
    const scope = user.scope.value
    const idTokenClaims: IDTokenClaims = {
      exp: this.exp,
      sub: user.id.toString(),
      scope: scope,
    }

    const emailClaims: IEmailClaims = this.scopeMatch(scope, 'email')
      ? { email: 'hgc-ab@outlook.com', email_verified: false }
      : {}

    const profileClaims: IProfileClaims = this.scopeMatch(scope, 'profile')
      ? { name: 'Name', nickname: 'nickName' }
      : {}

    const claims: IDTokenClaims = {
      ...idTokenClaims,
      ...emailClaims,
      ...profileClaims,
    }

    return this.jwt.generateToken(claims)
  }

  verifyIDToken(token: IDToken): IDTokenClaims {
    return this.jwt.verifyToken(token)
  }
}
