/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

/**
 * OAuth service interface
 */
export interface IAuthorizationService {
  token(username: string, password: string, scope?: string): Promise<any>
  hasExpired(token: object): Promise<any>
  revokeTokens(username: string): Promise<any>
}
