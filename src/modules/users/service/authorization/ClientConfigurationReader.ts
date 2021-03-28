/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

/**
 * Reads configuration settings for authorization
 */
export class ClientConfigurationReader {
  public static readEnvironment() {
    const id = process.env.CLIENT_ID || ''
    const secret = process.env.CLIENT_SECRET || ''
    const tokenHost = process.env.OAUTH_HOST || ''
    const tokenPath = process.env.OAUTH_TOKEN_PATH || ''
    const revokePath = process.env.OAUTH_REVOKE_PATH || ''
    const authorizationPath = process.env.OAUTH_AUTORIZE_PATH || ''

    return {
      client: {
        id,
        secret
      },
      auth: {
        tokenHost,
        tokenPath,
        revokePath
      }
    }
  }
}
