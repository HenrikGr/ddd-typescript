/**
 * @prettier
 * @copyright (c) 2021 - present, HGC-AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

/**
 * Result class
 *
 * This Result class purpose is to help creating
 * predictable and type safe programs.
 *
 * The class can;
 * - safely return error states,
 * - return valid results
 * - combine several results and determine the overall success or failure states
 *
 * With a new Result<T> instance, we can:
 * - check for validity with isSuccess
 * - check for failure using the isFailure
 * - collect the error with error
 * - collect the value with getValue()
 * - check for the validity of an array of Results using Result.combine(results: Result[])
 *
 * @class
 */
export class Result<T> {
  public isSuccess: boolean
  public isFailure: boolean
  public error: T | string
  private readonly _value: T

  /**
   * Create a new Result instance
   * @param isSuccess
   * @param error
   * @param value
   */
  public constructor(isSuccess: boolean, error?: T | string, value?: T) {
    if (isSuccess && error) {
      throw new Error('InvalidOperation: A result cannot be successful and contain an error')
    }
    if (!isSuccess && !error) {
      throw new Error('InvalidOperation: A failing result needs to contain an error message')
    }

    this.isSuccess = isSuccess
    this.isFailure = !isSuccess
    this.error = error as T
    this._value = value as T

    Object.freeze(this)
  }

  /**
   * Collect the result value
   */
  public getValue(): T {
    if (this.isFailure) {
      throw new Error("Can't get the value of an error result. Use 'errorValue' instead.")
    }

    return this._value
  }

  /**
   * Collect error value
   */
  public errorValue(): T {
    return this.error as T
  }

  /**
   * Check the validity of an array of Result instances
   * @param results
   */
  public static combine(results: Result<any>[]): Result<any> {
    for (let result of results) {
      if (result.isFailure) {
        return result
      }
    }
    return Result.ok()
  }

  /**
   * Factory method creating a successful Result instance
   * @param value
   */
  public static ok<U>(value?: U): Result<U> {
    return new Result<U>(true, '', value)
  }

  /**
   * Factory method creating a failed Result instance
   * @param error
   */
  public static fail<U>(error?: string): Result<U> {
    return new Result<U>(false, error)
  }
}

/**
 *
 */
export type Either<L, A> = Left<L, A> | Right<L, A>

/**
 *
 * @class
 */
export class Left<L, A> {
  readonly value: L

  constructor(value: L) {
    this.value = value
  }

  isLeft(): this is Left<L, A> {
    return true
  }

  isRight(): this is Right<L, A> {
    return false
  }
}

/**
 *
 * @class
 */
export class Right<L, A> {
  readonly value: A

  constructor(value: A) {
    this.value = value
  }

  isLeft(): this is Left<L, A> {
    return false
  }

  isRight(): this is Right<L, A> {
    return true
  }
}

export const left = <L, A>(l: L): Either<L, A> => {
  return new Left(l)
}

export const right = <L, A>(a: A): Either<L, A> => {
  return new Right<L, A>(a)
}
