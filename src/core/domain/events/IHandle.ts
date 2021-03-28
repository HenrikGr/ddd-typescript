/**
 * @prettier
 * @copyright (c) 2019 - present, HGC-AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { IDomainEvent } from "./IDomainEvent";

export interface IHandle<IDomainEvent> {
  setupSubscriptions(): void;
}
