/**
 * @prettier
 * @copyright (c) 2021 - present, HGC-AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */


import { Result } from "./Result";

export interface WithChanges {
  changes: Changes;
}

export class Changes {
  private changes: Result<any>[];

  constructor () {
    this.changes = [];
  }

  public addChange (result: Result<any>) : void {
    this.changes.push(result);
  }

  public getChangeResult (): Result<any> {
    return Result.combine(this.changes);
  }
}