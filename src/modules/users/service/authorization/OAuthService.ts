/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { ServiceLogger } from '@hgc-sdk/logger'

/**
 * OAuth service interface
 */
export interface IOAuthService {
  token(username: string, password: string, scope?: string): Promise<any>
  hasExpired(username: string, token: object): Promise<any>
  revokeTokens(username: string): Promise<any>
}

/**
 * OAuthService used to call OAuth2 server to authorize users
 */
export class OAuthService {
  private readonly EXPIRATION_WINDOW_IN_SECONDS = 300
  private oAuthClient: any
  private logger: ServiceLogger

  /**
   * Creates a new OAuthService instance
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
    this.logger.verbose('getAccessToken: ', username)
    const props = scope ? { username, password, scope } : { username, password }
    const accessToken = await this.oAuthClient.getToken(props)
    if(!accessToken) {
      return false
    }

    return accessToken.token
  }

  /**
   * Check if access token has expired and if so - refresh it
   * @param username
   * @param token
   */
  async hasExpired(username: string, token: object) {
    this.logger.verbose('hasExpired: ', username)
    const currentAccessToken = this.oAuthClient.createToken(token)
    if (currentAccessToken.expired(this.EXPIRATION_WINDOW_IN_SECONDS)) {
      this.logger.verbose('refreshing expired token: ', username)
      const accessToken = await currentAccessToken.refresh()
      if(!accessToken) {
        return false
      }
      return accessToken.token
    }

    return token
  }

  /**
   * Revoke all tokens for a user
   * @param username
   */
  public async revokeTokens(token: string) {
    const accessToken = this.oAuthClient.createToken(token)
    await accessToken.revokeAll()
  }

}
