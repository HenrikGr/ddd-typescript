/**
 * @prettier
 * @copyright (c) 2021 - present, HGC-AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import isEmail from 'validator/lib/isEmail'
import isLength from 'validator/lib/isLength'
import isMongoId from 'validator/lib/isMongoId'

/**
 * Guard result interface
 */
export interface IGuardResult {
  isSuccess: boolean
  message: string
}

/**
 * Guard argument interface
 */
export interface IGuardArgument {
  argument: any
  argumentName: string
}

/**
 * GuardArgumentCollection type
 */
export type GuardArgumentCollection = IGuardArgument[]

/**
 * Implements guard features for validation purposes
 */
export class Guard {
  /**
   * Combine several guard checks into one
   * @param guardResults
   */
  public static combine(guardResults: IGuardResult[]): IGuardResult {
    for (let result of guardResults) {
      if (!result.isSuccess) {
        return result
      }
    }

    return { isSuccess: true, message: '' }
  }

  /**
   * Guard against null or undefined rule
   * @param argument
   * @param argumentName
   */
  public static againstNullOrUndefined(argument: any, argumentName: string): IGuardResult {
    if (argument === null || argument === undefined) {
      return { isSuccess: false, message: `${argumentName} is null or undefined` }
    } else {
      return { isSuccess: true, message: '' }
    }
  }

  /**
   * Guard against null or undefined bulk rule
   * @param args
   */
  public static againstNullOrUndefinedBulk(args: GuardArgumentCollection): IGuardResult {
    for (let arg of args) {
      const result = this.againstNullOrUndefined(arg.argument, arg.argumentName)
      if (!result.isSuccess) return result
    }

    return { isSuccess: true, message: '' }
  }

  /**
   * Guard against invalid EntityId format
   * @param argument
   * @param argumentName
   */
  public static againstInvalidEntityId(argument: any, argumentName: string): IGuardResult {
    return isMongoId(argument)
      ? { isSuccess: true, message: '' }
      : { isSuccess: false, message: `${argumentName} is an invalid id.` }
  }

  /**
   * Guard against invalid email format
   * @param argument
   * @param argumentName
   */
  public static againstInvalidEmailAddress(argument: any, argumentName: string): IGuardResult {
    const result = this.againstNullOrUndefined(argument, argumentName)
    if (!result.isSuccess) {
      return result
    }

    return isEmail(argument, {
      allow_utf8_local_part: false, // Do not allow NON utf-8 chars
    })
      ? { isSuccess: true, message: '' }
      : { isSuccess: false, message: `${argumentName} is not a valid format.` }
  }

  /**
   * Guard against invalid password rule
   * @param argument
   * @param argumentName
   */
  public static againstInvalidPasswordFormat(argument: any, argumentName: string): IGuardResult {
    const result = this.againstNullOrUndefined(argument, argumentName)
    if (!result.isSuccess) {
      return result
    }
    const validPasswordRegEx = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/
    return validPasswordRegEx.test(argument)
      ? { isSuccess: true, message: '' }
      : {
          isSuccess: false,
          message: `${argumentName} must be 6 to 20 characters and at least one numeric, one uppercase and one lowercase`,
        }
  }

  /**
   * Guard against invalid username
   * @param argument
   * @param argumentName
   */
  public static againstInvalidUserName(argument: any, argumentName: string): IGuardResult {
    const result = this.againstNullOrUndefined(argument, argumentName)
    if (!result.isSuccess) {
      return result
    }

    return isLength(argument, { min: 5, max: 12 })
      ? { isSuccess: true, message: '' }
      : { isSuccess: false, message: `${argumentName} must be 5 to 15 characters.` }
  }

  /**
   * Guard against greater than rule
   * @param minValue
   * @param actualValue
   */
  public static greaterThan(minValue: number, actualValue: number): IGuardResult {
    return actualValue > minValue
      ? { isSuccess: true, message: '' }
      : { isSuccess: false, message: `Number given {${actualValue}} is not greater than {${minValue}}` }
  }

  /**
   * Guard against at least rule
   * @param numChars
   * @param argument
   * @param argumentName
   */
  public static againstAtLeast(numChars: number, argument: string, argumentName: string): IGuardResult {
    return argument.length >= numChars
      ? { isSuccess: true, message: '' }
      : { isSuccess: false, message: `${argumentName} is not at least ${numChars} chars.` }
  }

  /**
   * Guard against at most rule
   * @param numChars
   * @param argument
   * @param argumentName
   */
  public static againstAtMost(numChars: number, argument: string, argumentName: string): IGuardResult {
    return argument.length <= numChars
      ? { isSuccess: true, message: '' }
      : { isSuccess: false, message: `${argumentName} is greater than ${numChars} chars.` }
  }

  /**
   * Guard oneOf rule
   * @param value
   * @param validValues
   * @param argumentName
   */
  public static isOneOf(value: any, validValues: any[], argumentName: string): IGuardResult {
    let isValid = false
    for (let validValue of validValues) {
      if (value === validValue) {
        isValid = true
      }
    }

    if (isValid) {
      return { isSuccess: true, message: '' }
    } else {
      return {
        isSuccess: false,
        message: `${argumentName} isn't oneOf the correct types in ${JSON.stringify(
          validValues
        )}. Got "${value}".`,
      }
    }
  }

  /**
   * Guard in range rule
   * @param num
   * @param min
   * @param max
   * @param argumentName
   */
  public static inRange(num: number, min: number, max: number, argumentName: string): IGuardResult {
    const isInRange = num >= min && num <= max
    if (!isInRange) {
      return { isSuccess: false, message: `${argumentName} is not within range ${min} to ${max}.` }
    } else {
      return { isSuccess: true, message: '' }
    }
  }

  /**
   * Guard all in range rule
   * @param numbers
   * @param min
   * @param max
   * @param argumentName
   */
  public static allInRange(numbers: number[], min: number, max: number, argumentName: string): IGuardResult {
    for (let num of numbers) {
      const numIsInRangeResult = this.inRange(num, min, max, argumentName)
      if (!numIsInRangeResult.isSuccess) {
        return { isSuccess: false, message: `${argumentName} is not within the range.` }
      }
    }

    return { isSuccess: true, message: '' }
  }
}
