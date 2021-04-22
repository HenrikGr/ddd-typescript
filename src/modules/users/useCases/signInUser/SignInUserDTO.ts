/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

/**
 * SignInUser DTO interface
 */
export interface SignInDTO {
  username: string
  password: string
  scope: string
}

type Bearer = string

export interface SignInResponseDTO {
  access_token: string,
  token_type: Bearer,
  expires_in: number,
  refresh_token: string,
  scope: string,
  expires_at: Date
}
