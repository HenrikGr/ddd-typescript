import jwt, { Algorithm } from 'jsonwebtoken'
import { IJWTConfigurationReader, JWTConfiguration } from './JWTConfigurationReader'
import { IDTokenClaims } from '../TokenClaims'

/**
 * Reserved: Claims defined by the JWT specification to ensure interoperability
 * with third-party, or external, applications. OIDC standard claims are reserved claims.
 */
export interface JWTStandardClaims {
  alg: Algorithm
  iss: string
  aud: string
  exp: number
  nbf: number
}

/**
 * Supported claims
 */
type Claims = JWTStandardClaims | IDTokenClaims

/**
 * Implements methods to create and verify jwt tokens
 */
export class JWT {
  private readonly privateKey: string
  private readonly publicKey: string
  private readonly jwtClaims: JWTStandardClaims

  constructor(configurationReader: IJWTConfigurationReader) {
    const jwtConfig: JWTConfiguration = configurationReader.readEnvironment()
    this.privateKey = jwtConfig.privateKey
    this.publicKey = jwtConfig.publicKey
    this.jwtClaims = {
      alg: 'RS256',
      iss: jwtConfig.iss,
      aud: jwtConfig.aud,
      exp: Math.floor(Date.now() / 1000) + 60 * 60, // Default 1 hour
      nbf: Math.floor(Date.now() / 1000), // now
    }
  }

  /**
   * Generate a token based on supported claims
   * @param claims
   */
  generateToken(claims: Claims) {
    const payload = {
      ...this.jwtClaims,
      ...claims, // Override exp for IDToken, AccessToken, RefreshTokens, etc
    }

    return jwt.sign(payload, this.privateKey, { algorithm: this.jwtClaims.alg })
  }

  /**
   * verify a generated token
   * @param token
   */
  verifyToken(token: string): string | object {
    // TODO: Ensure changes to aud and iss is not possible
    return jwt.verify(
      token,
      this.publicKey,
      { audience: this.jwtClaims.aud, issuer: this.jwtClaims.iss }
    )
  }
}
