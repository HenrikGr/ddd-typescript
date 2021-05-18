/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

/**
 * ID tokens are used in token-based authentication to cache user profile information
 * and provide it to a client application, thereby providing better performance and
 * experience. The application receives an ID token after a user successfully authenticates,
 * then consumes the ID token and extracts user information from it, which it can
 * then use to personalize the user's experience.
 *
 * For example, suppose you have a regular web app that you register and configure to allow
 * users to login with Google. Once a user logs in, use the ID token to gather information such as name
 * and email address, which you can then use to auto-generate and send a personalized welcome email.
 *
 * ID Tokens should never be used to obtain direct access to APIs or to make authorization decisions.
 *
 */

export interface IEmailClaims {
  email?: string
  email_verified?: boolean
}

export interface IProfileClaims {
  name?: string
  nickname?: string
  picture?: string
}

export interface IDTokenClaims extends IEmailClaims, IProfileClaims {
  sub: string     // Contains user id, is retrieved after authentication
  scope: string   // email: to get email and email_verified, profile to get name, nickname and picture
  exp: number     // Expire time
  nonce?: string  // Use this to connect a session id with an ID token
}

