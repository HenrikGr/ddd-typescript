/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { ServiceLogger } from '@hgc-sdk/logger'
import { BadRequest } from './BaseError'
import { IAuthorizationService } from '../IAuthorizationService'

/**
 * Implementation of Authorization service managing calls to the OAuth" server
 */
export class AuthorizationService implements IAuthorizationService {
  private readonly EXPIRATION_WINDOW_IN_SECONDS = 300
  private oAuthClient: any
  private logger: ServiceLogger

  /**
   * Creates a new Authorization instance
   * @param oAuthClient
   * @param logger
   */
  constructor(oAuthClient: any, logger: ServiceLogger) {
    this.oAuthClient = oAuthClient
    this.logger = logger
  }

  /**
   * Requests and returns an access token from the authorization server
   * @param username
   * @param password
   * @param scope
   */
  public async token(username: string, password: string, scope?: string) {
    const props = scope ? { username, password, scope } : { username, password }
    try {
      const accessToken = await this.oAuthClient.getToken(props)
      if (!accessToken) {
        return false
      }
      return accessToken.token
    } catch (e) {
      const { data } = e
      return new BadRequest(data.payload.error_description)
    }
  }

  /**
   * Check if access token has expired and if so - refresh it
   * @param token
   */
  async hasExpired(token: object) {
    this.logger.verbose('hasExpired: ', token)
    const currentAccessToken = this.oAuthClient.createToken(token)
    if (currentAccessToken.expired(this.EXPIRATION_WINDOW_IN_SECONDS)) {
      this.logger.verbose('refreshing expired token: ', token)
      const accessToken = await currentAccessToken.refresh()
      if (!accessToken) {
        return false
      }
      return accessToken.token
    }

    return token
  }

  async refreshIfExpired(token: object) {}

  /**
   * Revoke all tokens for a user
   * @param token
   */
  public async revokeTokens(token: string) {
    const accessToken = this.oAuthClient.createToken(token)
    await accessToken.revokeAll()
  }
}
