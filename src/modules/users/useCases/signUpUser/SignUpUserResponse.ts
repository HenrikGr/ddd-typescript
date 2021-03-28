/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { Either, Result } from '../../../../core/common/Result'
import { AppError } from '../../../../core/common/AppError'
import { SignUpUserErrors } from './SignUpUserErrors'

/**
 * Use case response types
 */
export type SignUpUserResponse = Either<
  | SignUpUserErrors.ValidationError
  | SignUpUserErrors.UserIsMarkedForDeletion
  | SignUpUserErrors.EmailAlreadyExists
  | SignUpUserErrors.UsernameTaken
  | SignUpUserErrors.UnableToSaveUser
  | AppError.UnexpectedError
  | Result<any>,
  Result<void>
  >

