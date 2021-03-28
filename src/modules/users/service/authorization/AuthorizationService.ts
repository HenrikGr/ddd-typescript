/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

const { ResourceOwnerPassword } = require('simple-oauth2')
import { AccessTokenModel } from '../../infra/database/models/AccessTokenModel'
import { ClientConfigurationReader } from './ClientConfigurationReader'
import { IAccessToken } from '../../useCases/signInUser/SignInUserDTO'

export interface IAuthorizationService {
  getAuthorizationToken(username: string, password: string, scope?: string): Promise<any>
  refreshAccessToken(username: string, scope?: string): Promise<any>
}

/**
 * Authorization service
 */
export class AuthorizationService {
  private readonly EXPIRATION_WINDOW_IN_SECONDS = 300
  private readonly config: any
  private client: any
  private model: any

  /**
   * Creates a new AuthorizationService instance
   * @param model
   */
  constructor(model: AccessTokenModel) {
    this.config = ClientConfigurationReader.readEnvironment()
    this.client = new ResourceOwnerPassword(this.config)
    this.model = model
  }

  protected serialize(token: IAccessToken) {
    return JSON.stringify(token)
  }

  protected deserialize(serializedToken: string) {
    return JSON.parse(serializedToken)
  }

  /**
   * Get the serialized access token from database, creates a new
   * AccessToken instance and returns it
   * @param username
   */
  protected getAccessToken(username: string) {
    const serializedToken = this.model.findAccessToken(username)
    // Client deserialize the store access token and we can now refresh
    return this.client.createToken(this.deserialize(serializedToken))
  }

  /**
   * Store the AccessToken in serialized format to the database
   * @param username
   * @param token
   */
  protected async saveAccessToken(username: string, token: IAccessToken) {
    const serializedToken = this.serialize(token)
    // The creates or update an existing token
    return await this.model.updateAccessToken(username, serializedToken)
  }

  /**
   * Get access token from authorization server and return an instance of AccessToken
   * @param username
   * @param password
   * @param scope
   */
  public async getAuthorizationToken(username: string, password: string, scope?: string) {
    const props = scope ? { username, password, scope } : { username, password }
    const accessToken = await this.client.getToken(props)

    if(!accessToken) {
      return false
    }

    const isSaved = await this.saveAccessToken(username, accessToken)
    if (!isSaved) {
      return false
    }

    return accessToken.token
  }

  // Get access token (refresh) from authorization server
  public async refreshAccessToken(username: string, scope?: string) {
    // Get an AccessToken instance
    const accessToken = this.getAccessToken(username)
    return await accessToken.refresh(scope)
  }

}
