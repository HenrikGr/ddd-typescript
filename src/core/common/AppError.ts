/**
 * @prettier
 * @copyright (c) 2021 - present, HGC-AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */


import { Result } from "./Result";
import { UseCaseError } from "../domain/UseCaseError";

export namespace AppError {

  export class UnexpectedError extends Result<UseCaseError> {
    public constructor (err: any) {
      super(false, {
        message: `An unexpected error occurred.`,
        error: err
      } as UseCaseError)

      console.log(`[AppError]: An unexpected error occurred`);
      console.error(`[ErrorName]: ${err.name}`);
      console.error(`[ErrorMessage]: ${err.message}`);
    }

    public static create (err: any): UnexpectedError {
      return new UnexpectedError(err);
    }
  }
}
