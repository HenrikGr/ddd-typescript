import { strict as assert } from 'assert'

require('dotenv').config()
import { JWTConfigurationReader } from '../JWTConfigurationReader'
import { JWT } from '../JWT'
import { IDTokenClaims, IEmailClaims, IProfileClaims } from '../IClaims'

describe('JWT', function () {
  assert(process.env.JWT_ISS, 'process.env.SERVER_KEY_FILE missing')
  assert(process.env.JWT_AUD, 'process.env.SERVER_CERT_FILE missing')

  // Get valid issuer and audience from env variables
  const validIss = process.env.JWT_ISS
  const validAud = process.env.JWT_AUD
  const exp1Hour = Math.floor(Date.now() / 1000) + 60 * 60 // Default 1 hour

  describe('JWTConfiguration', () => {
    test('Check valid iss and aud -> should contain iss and aud from environment', () => {
      const config = JWTConfigurationReader.readEnvironment()
      expect(config.iss).toBe(validIss)
      expect(config.aud).toBe(validAud)
    })
  })

  describe('JWT Instance', () => {
    test('Create a JWT instance -> should contain correct properties', () => {
      const jwt = new JWT(JWTConfigurationReader.readEnvironment())

      expect(jwt).toBeInstanceOf(JWT)
      expect(jwt).toHaveProperty('privateKey')
      expect(jwt).toHaveProperty('publicKey')
      expect(jwt).toHaveProperty('jwtClaims')
    })
  })

  describe('IDTokenClaims', () => {
    test('Generate an IDToken with scope email -> should be valid', () => {
      const claims: IDTokenClaims = {
        exp: exp1Hour,
        sub: '1234567890',
        scope: 'email',
      }

      const jwt = new JWT(JWTConfigurationReader.readEnvironment())
      const token = jwt.generateToken(claims)
      const decodedIdToken = jwt.verifyToken(token)

      expect(decodedIdToken).toBeTruthy()
      expect(decodedIdToken.exp).toBe(claims.exp)
      expect(decodedIdToken.sub).toBe(claims.sub)
      expect(decodedIdToken.scope).toBe(claims.scope)
    })

    test('Generate an IDToken with scope profile -> should be valid', () => {
      const claims: IDTokenClaims = {
        exp: exp1Hour,
        sub: '1234567890',
        scope: 'profile',
      }

      const jwt = new JWT(JWTConfigurationReader.readEnvironment())
      const token = jwt.generateToken(claims)
      const decodedIdToken = jwt.verifyToken(token)

      expect(decodedIdToken).toBeTruthy()
      expect(decodedIdToken.exp).toBe(claims.exp)
      expect(decodedIdToken.sub).toBe(claims.sub)
      expect(decodedIdToken.scope).toBe(claims.scope)
    })
  })

  describe('Claims', () => {
    test('Generate an combined claim based on scope email -> should be valid', () => {
      const idTokenClaims: IDTokenClaims = {
        exp: exp1Hour,
        sub: '1234567890',
        scope: 'email',
      }

      const emailClaims: IEmailClaims = {
        email: 'hgc-ab@outlook.com',
        email_verified: false
      }

      const claims: IDTokenClaims = {
        ...idTokenClaims,
        ...emailClaims
      }

      const jwt = new JWT(JWTConfigurationReader.readEnvironment())
      const token = jwt.generateToken(claims)
      const decodedIdToken = jwt.verifyToken(token)

      console.log('combined claims: ', decodedIdToken)
      expect(decodedIdToken).toBeTruthy()
      expect(decodedIdToken.exp).toBe(claims.exp)
      expect(decodedIdToken.sub).toBe(claims.sub)
      expect(decodedIdToken.scope).toBe(claims.scope)
      expect(decodedIdToken.email).toBe(claims.email)
      expect(decodedIdToken.email_verified).toBe(claims.email_verified)
    })
  })


})
