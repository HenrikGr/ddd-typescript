/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { JWT } from './JWT'
import { IUserDao } from '../../../infra/database/UserDao'

export interface IDTokenClaims {
  sub: string
  email: string
  email_verified: boolean
  exp?: number
  scope?: string // email: to get email and email_verified, profile to get name, nickname and picture
  nonce?: string // Use this to connect a session id with an ID token
}

export type IDToken = string


export interface IAuthService {
  createToken(claims: IDTokenClaims): IDToken
  decodeToken(token: string): Promise<IDTokenClaims>
  //createRefreshToken (): RefreshToken;
  //getTokens (username: string): Promise<string[]>;
  //saveAuthenticatedUser (user: User): Promise<void>;
  //deAuthenticateUser(username: string): Promise<void>;
  //refreshTokenExists (refreshToken: RefreshToken): Promise<boolean>;
  //getUserNameFromRefreshToken (refreshToken: RefreshToken): Promise<string>;
}

export class AuthService {
  private jwt: JWT
  private userDao: IUserDao

  constructor(jwt: JWT, userDao: IUserDao) {
    this.jwt = jwt
    this.userDao = userDao
  }

  createToken(claims: IDTokenClaims): IDToken {
    return this.jwt.generateToken(claims)
  }

  decodeToken(token: IDToken): IDTokenClaims {
    const decodedToken: any = this.jwt.verifyToken(token)

    return {
      sub: decodedToken.sub,
      exp: decodedToken.exp,
      email: decodedToken.email,
      email_verified: decodedToken.email_varified,
      scope: decodedToken.scope,
    }
  }


  createIDToken(props: any) {

  }


}
