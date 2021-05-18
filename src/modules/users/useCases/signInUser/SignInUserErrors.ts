/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { UseCaseError } from '../../../../core/domain/UseCaseError'
import { Result } from '../../../../core/common/Result'

export namespace SignInUserErrors {
  export class ValidationError extends Result<UseCaseError> {
    constructor(parameter: string) {
      super(false, {
        message: `${parameter}`,
      } as UseCaseError)
    }
  }
  export class UserIsMarkedForDeletion extends Result<UseCaseError> {
    constructor(parameter?: string) {
      super(false, {
        message: `The user is marked for deletion: Contact support for assistance.`,
      } as UseCaseError)
    }
  }

  export class InvalidCredential extends Result<UseCaseError> {
    constructor(parameter?: string) {
      super(false, {
        message: `Username or password is invalid.`,
      } as UseCaseError)
    }
  }

  export class NotAuthorized extends Result<UseCaseError> {
    constructor(parameter?: string) {
      super(false, {
        message: parameter ? `${parameter}` : `Request was not authorized`,
      } as UseCaseError)
    }
  }
}
