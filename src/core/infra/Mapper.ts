/**
 * @prettier
 * @copyright (c) 2019 - present, HGC-AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

 /**
  * The responsibility of a Mapper is to make all the transformations:
  * - From Domain to DTO
  * - From Domain to Persistence
  * - From Persistence to Domain
  */
export interface Mapper<T> {
  // public static toDomain (raw: any): T;
  // public static toDTO (t: T): DTO;
  // public static toPersistence (t: T): any;
}
