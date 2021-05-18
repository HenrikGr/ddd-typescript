/**
 * @prettier
 * @copyright (c) 2021 - present, HGC-AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { UniqueEntityID } from "../UniqueEntityID";

export interface IDomainEvent  {
  dateTimeOccurred: Date
  aggregateId: UniqueEntityID
  eventType: string
  meta: any
}


