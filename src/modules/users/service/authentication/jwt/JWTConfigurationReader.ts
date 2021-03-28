/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import fs from 'fs'

/**
 * JWT configuration reader interface
 */
export interface IJWTConfigurationReader {
  readEnvironment(): JWTConfiguration
}

/**
 * JWT environment configuration
 */
export interface JWTConfiguration {
  publicKey: string
  privateKey: string
  iss: string
  aud: string
  exp: number
  nbf: number
}

/**
 * Reads configuration settings for jwt
 */
export class JWTConfigurationReader {
  /**
   * Read in the jwt configuration settings from environment variables
   */
  public static readEnvironment(): JWTConfiguration {
    // PEM encoded public key for RSA and ECDSA
    const publicKeyPath = process.env.JWT_PUBLIC_KEY || ''
    // PEM encoded private key for RSA and ECDSA
    const privateKeyPath = process.env.JWT_PRIVATE_KEY || ''
    const iss = process.env.JWT_ISS || ''
    const aud = process.env.JWT_AUD || ''

    if (publicKeyPath === '' || privateKeyPath === '') {
      throw new Error('Unable to read JWT keys from environment.')
    }

    const publicKey = fs.readFileSync(publicKeyPath, 'utf8')
    const privateKey = fs.readFileSync(privateKeyPath, 'utf8')

    return {
      publicKey,
      privateKey,
      iss,
      aud,
      exp: Math.floor(Date.now() / 1000) + 60 * 60, // Default 1 hour
      nbf: Math.floor(Date.now() / 1000), // now
    }
  }
}
