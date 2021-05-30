/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { User } from '../domain/User'

/**
 * User repository interface
 *
 * Mediates between the domain and data mapping layers using a collection-like
 * interface for accessing domain objects.
 *
 * A system with a complex domain model often benefits from a layer, such as the
 * one provided by Data Mapper, that isolates domain objects from details of the
 * database access code. In such systems it can be worthwhile  to build another
 * layer of abstraction over the mapping layer where query construction code is
 * concentrated. This becomes more important when there are many domain classes or
 * heavy querying. In these cases particularly, adding this layer helps minimize
 * duplicate query logic.
 *
 * Repository also supports the objective of achieving a clean separation and
 * one-way dependency between the domain and data mapping layers.
 *
 * Repositories centralize common data access functionality. They encapsulate the
 * logic required to access that data. Entities/aggregates can be put into a
 * repository and then retrieved at a later time without domain even knowing where
 * data is saved, in a database, or a file, or some other source.
 *
 * We use repositories to decouple the infrastructure or technology used to access
 * databases from the domain model layer.
 *
 * This project contains abstract repository class that allows to make basic CRUD
 * operations.
 */
export interface IUserRepo {
  exists(username: string, email?: string): Promise<User | boolean>
  save(user: User): Promise<boolean>
  markUserForDeletion(user: User): Promise<boolean>
  delete(user: User): Promise<boolean>
}
