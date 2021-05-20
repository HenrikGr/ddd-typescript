/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { ServiceLogger } from '@hgc-sdk/logger'
import jwt, { Algorithm } from 'jsonwebtoken'
import { JWTConfiguration } from './JWTConfigurationReader'
import { IDTokenClaims, IEmailClaims, IProfileClaims } from './IClaims'
import { User } from '../../../domain/User'

/**
 * Standard JWT claims
 */
interface JWTStandardClaims {
  iss: string   // Issuer of the JWT
  aud: string   // Recipient for which the JWT is intended, clientId for the application
  exp: number   // Time after which the JWT expires
  nbf?: number  // Time before which the JWT must not be accepted for processing
  iat?: number  // Time at which the JWT was issued; can be used to determine age of the JWT
}

export type IDToken = string

/**
 * Implements methods to create and verify jwt tokens
 */
export class JWT {
  private readonly alg: Algorithm
  private readonly jwtClaims: JWTStandardClaims
  private readonly privateKey: string
  private readonly publicKey: string
  private readonly idTokenLifeTime: number
  private logger: ServiceLogger

  /**
   * Creates a new JWT instance
   * @param config
   * @param logger
   */
  constructor(config: JWTConfiguration, logger: ServiceLogger) {
    const jwtConfig = config
    this.alg = 'RS256'
    this.privateKey = jwtConfig.privateKey
    this.publicKey = jwtConfig.publicKey
    this.jwtClaims = {
      iss: jwtConfig.iss,
      aud: jwtConfig.aud,
      exp: 0,
    }
    this.idTokenLifeTime = 60 * 60 * 10 // 10 hour
    this.logger = logger
  }

  private scopeMatch(scope: string, targetScope: string): string | undefined {
    return scope.split(' ').find((s) => s === targetScope)
  }

  private generateToken(claims: IDTokenClaims) {
    const payload = {
      ...this.jwtClaims,
      ...claims, // Override exp from IDTokenClaims
    }

    return jwt.sign(payload, this.privateKey, { algorithm: this.alg })
  }

  /**
   * Verify token - decode
   * @param token
   */
  public verifyToken(token: string): IDTokenClaims {
    // TODO: Ensure changes to aud and iss is not possible
    return jwt.verify(token, this.publicKey, {
      audience: this.jwtClaims.aud,
      issuer: this.jwtClaims.iss,
    }) as IDTokenClaims
  }

  /**
   * Create a IDToken
   * @param user
   */
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

    return this.generateToken(claims)
  }

}
