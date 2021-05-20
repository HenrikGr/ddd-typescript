/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { ServiceLogger } from '@hgc-sdk/logger'
import jwt, { Algorithm } from 'jsonwebtoken'
import { JWTConfiguration } from './JWTConfigurationReader'

interface JWTStandardClaims {
  iss: string   // Issuer of the JWT
  aud: string   // Recipient for which the JWT is intended, clientId for the application
  exp: number   // Time after which the JWT expires
  nbf?: number  // Time before which the JWT must not be accepted for processing
  iat?: number  // Time at which the JWT was issued; can be used to determine age of the JWT
}

export interface IEmailClaims {
  email?: string
  email_verified?: boolean
}

export interface IProfileClaims {
  name?: string
  nickname?: string
  picture?: string
}

export interface IDTokenClaims extends IEmailClaims, IProfileClaims {
  sub: string     // Contains user id, is retrieved after authentication
  scope: string   // email: to get email and email_verified, profile to get name, nickname and picture
  exp: number     // Expire time
  nonce?: string  // Use this to connect a session id with an ID token
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
    this.logger = logger
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
   * @param claims
   */
  public createIDToken(claims: IDTokenClaims): IDToken {
    const payload = {
      ...this.jwtClaims,
      ...claims, // Override exp which is set to 0 default
    }

    return jwt.sign(payload, this.privateKey, { algorithm: this.alg })
  }

}
