/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import jwt, { Algorithm } from 'jsonwebtoken'
import { IJWTConfigurationReader, JWTConfiguration } from './JWTConfigurationReader'
import { IDTokenClaims } from './IClaims'

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

/**
 * Implements methods to create and verify jwt tokens
 */
export class JWT {
  private readonly alg: Algorithm
  private readonly jwtClaims: JWTStandardClaims
  private readonly privateKey: string
  private readonly publicKey: string

  /**
   * Creates a new JWT instance
   * @param config
   */
  constructor(config: JWTConfiguration) {
    const jwtConfig = config
    this.alg = 'RS256'
    this.privateKey = jwtConfig.privateKey
    this.publicKey = jwtConfig.publicKey
    this.jwtClaims = {
      iss: jwtConfig.iss,
      aud: jwtConfig.aud,
      exp: 0,
    }
  }

  /**
   * Generate/sign a token
   * @param claims
   */
  generateToken(claims: IDTokenClaims) {
    const payload = {
      ...this.jwtClaims,
      ...claims, // Override exp from IDTokenClaims
    }

    return jwt.sign(payload, this.privateKey, { algorithm: this.alg })
  }

  /**
   * Verify a generated token and return the decoded token
   * @param token
   */
  verifyToken(token: string): IDTokenClaims {
    // TODO: Ensure changes to aud and iss is not possible
    return jwt.verify(token, this.publicKey, {
      audience: this.jwtClaims.aud,
      issuer: this.jwtClaims.iss,
    }) as IDTokenClaims
  }
}
