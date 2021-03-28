/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { UseCaseError } from '../../../../core/domain/UseCaseError'
import { Result } from '../../../../core/common/Result'

export namespace DeleteUserErrors {

  export class ValidationError extends Result<UseCaseError> {
    constructor(parameter: string) {
      super(false, {
        message: `${parameter}`,
      } as UseCaseError)
    }
  }

  export class UserNotFound extends Result<UseCaseError> {
    constructor(parameter: string) {
      super(false, {
        message: `User ${parameter} not found.`,
      } as UseCaseError)
    }
  }

  export class UserIsMarkedForDeletion extends Result<UseCaseError> {
    constructor(parameter: string) {
      super(false, {
        message: `The user ${parameter} is marked for deletion: Contact support for assistance.`,
      } as UseCaseError)
    }
  }

  export class UnableToDeleteUser extends Result<UseCaseError> {
    constructor(parameter: string) {
      super(false, {
        message: `Unable to delete user ${parameter}: Contact support for assistance.`,
      } as UseCaseError)
    }
  }
}
