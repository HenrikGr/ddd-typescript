/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

export interface IDTokenClaims {
  sub: string
  email: string
  email_verified: boolean
  exp?: number
  scope?: string // email: to get email and email_verified, profile to get name, nickname and picture
  nonce?: string // Use this to connect a session id with an ID token
}

/**
 * Implements ID token logic
 *
 * ID tokens are used in token-based authentication to cache user profile information
 * and provide it to a client application, thereby providing better performance and
 * experience. The application receives an ID token after a user successfully authenticates,
 * then consumes the ID token and extracts user information from it, which it can
 * then use to personalize the user's experience.
 *
 * ID tokens follow the JSON Web Token (JWT) standard, which means that their basic structure
 * conforms to the typical JWT Structure, and they contain standard JWT Claims asserted
 * about the token itself.
 *
 * Beyond what is required for JWT, ID tokens also contain claims asserted about the
 * authenticated user, which are pre-defined by the OpenID Connect (OIDC) protocol,
 * and are thus known as standard OIDC claims. Some standard OIDC claims include:
 *
 * name
 * nickname
 * picture
 * email
 * email_verified
 *
 */
