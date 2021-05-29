/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { UseCaseError } from '../../../../core/domain/UseCaseError'
import { Result } from '../../../../core/common/Result'

/**
 * SignUpErrors namespace containing possible errors for the use case.
 */
export namespace SignUpErrors {
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

  export class EmailAlreadyExists extends Result<UseCaseError> {
    constructor(parameter: string) {
      super(false, {
        message: `The email ${parameter} already exists`,
      } as UseCaseError)
    }
  }

  export class UsernameTaken extends Result<UseCaseError> {
    constructor(parameter: string) {
      super(false, {
        message: `The username ${parameter} is already taken`,
      } as UseCaseError)
    }
  }

  export class UnableToSaveUser extends Result<UseCaseError> {
    constructor(parameter: string) {
      super(false, {
        message: `Unable to save ${parameter}: Contact support for assistance.`,
      } as UseCaseError)
    }
  }
}
