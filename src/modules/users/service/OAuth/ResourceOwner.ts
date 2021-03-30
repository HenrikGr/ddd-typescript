/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { ServiceLogger } from '@hgc-sdk/logger'
import { ISessionDao } from '../../infra/database/dao/SessionDao'

export interface IResourceOwner {
  getAccessToken(username: string, password: string, scope?: string): Promise<any>
  hasExpired(username: string, token: object): Promise<any>
  revokeTokens(username: string): Promise<any>
}

/**
 * Resource owner authorization service
 */
export class ResourceOwner {
  private readonly EXPIRATION_WINDOW_IN_SECONDS = 300
  private oAuthClient: any
  private sessionDao: ISessionDao
  private logger: ServiceLogger

  /**
   * Creates a new AuthorizationService instance
   * @param sessionDao
   * @param oAuthClient
   * @param logger
   */
  constructor(sessionDao: ISessionDao, oAuthClient: any, logger: ServiceLogger) {
    this.sessionDao = sessionDao
    this.oAuthClient = oAuthClient
    this.logger = logger
  }

  /**
   * Requests and returns an access token from the authorization server
   * @param username
   * @param password
   * @param scope
   */
  public async getAccessToken(username: string, password: string, scope?: string) {
    this.logger.verbose('getAccessToken: ', username)
    const props = scope ? { username, password, scope } : { username, password }
    const accessToken = await this.oAuthClient.getToken(props)
    if(!accessToken) {
      return false
    }

    const isSaved = await this.sessionDao.updateSession(username, accessToken)
    if (!isSaved) {
      return false
    }

    return accessToken.token
  }

  /**
   * Check if an plain access token has expired and if so - refresh it
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
      const isSaved = await this.sessionDao.updateSession(username, accessToken)
      if (!isSaved) {
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
  public async revokeTokens(username: string) {
    this.logger.verbose('revokeTokens: ', username)
    const sessionAccessToken = await this.sessionDao.getSession(username)
    const accessToken = this.oAuthClient.createToken(sessionAccessToken)
    await accessToken.revokeAll()
  }

}
