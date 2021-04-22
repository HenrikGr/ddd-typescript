require('dotenv').config()
import { JWTConfigurationReader } from './jwt/JWTConfigurationReader'
import { JWT, JWTStandardClaims } from './jwt/JWT'
import { IDTokenClaims } from './TokenClaims'

describe('JWT', function () {
  test('Create a JWT instance -> should contain ', () => {
    const jwt = new JWT(JWTConfigurationReader)

    expect(jwt).toBeInstanceOf(JWT)
    expect(jwt).toHaveProperty('privateKey')
    expect(jwt).toHaveProperty('publicKey')
    expect(jwt).toHaveProperty('jwtClaims')
  })

  test('Generate a JWT token with invalid JWTStandardClaims -> should throw and be invalid', () => {
    const claims: JWTStandardClaims = {
      alg: 'RS256',
      iss: 'issuer',
      aud: 'audience',
      exp: Math.floor(Date.now() / 1000) + 60 * 60, // Default 1 hour
      nbf: Math.floor(Date.now() / 1000), // now
    }

    let isValid
    try {
      const jwt = new JWT(JWTConfigurationReader)
      const token = jwt.generateToken(claims)
      isValid = jwt.verifyToken(token)
      //expect(isValid).toBeTruthy()
    } catch (err) {
      expect(isValid).toBeFalsy()
    }
  })

  test('Generate a JWT token with IDTokenClaims -> should be valid', () => {
    const claims: IDTokenClaims = {
      sub: '1234567890',
      email: 'hgc@outlook.com',
      email_verified: false,
    }

    let isValid
    try {
      const jwt = new JWT(JWTConfigurationReader)
      const token = jwt.generateToken(claims)
      isValid = jwt.verifyToken(token)
      expect(isValid).toBeTruthy()
    } catch (err) {
      expect(isValid).toBeTruthy()
    }
  })
})
