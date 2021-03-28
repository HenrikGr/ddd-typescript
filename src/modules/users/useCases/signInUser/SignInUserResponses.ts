/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { Either, Result } from '../../../../core/common/Result'
import { AppError } from '../../../../core/common/AppError'
import { SignInUserErrors } from './SignInUserErrors'
import { ISignInUserResponseDTO } from './SignInUserDTO'

/**
 * Use case response types
 */
export type SignInUserResponse = Either<
  | SignInUserErrors.ValidationError
  | SignInUserErrors.InvalidCredential
  | SignInUserErrors.UserIsMarkedForDeletion
  | SignInUserErrors.NotAuthorized
  | AppError.UnexpectedError,
  Result<ISignInUserResponseDTO>
  >

