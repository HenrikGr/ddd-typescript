/**
 * @prettier
 * @copyright (c) 2019 - present, HGC-AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

/**
 * Being able to create Domain Entity Objects without having to rely on a db configuration
 * is desirable because it means that our unit tests can run really quickly, and
 * it's a good idea to separate concerns between creating objects and persisting objects.
 *
 * This technique also simplifies how we can use Domain Events to allow other subdomains
 * and bounded contexts to react to changes in our systems.
 *
 * A typical example:
 * Create an entity (like User) by calling User.create(props: UserProps).
 * When the entity is created, a unique UUID is assigned to it.
 * Pass the entity to a UserRepository.
 * The UserRepository uses a Mapper to structure the entity into the JSON object needed for the
 * ORM to save it to the database (like `UserMap.toSequelizeProps(user: User): any` or `UserMap.toTypeORM(user: User): any`,
 * including the UUID used for the primary key field
 */

//import { v4 as uuid } from 'uuid'
import { Identifier } from './Identifier'
import { ObjectId, ObjectID } from 'mongodb'

/**
 * Implements generation of unique id
 */
export class UniqueEntityID extends Identifier<string | ObjectId>{
  constructor (id?: string) {
    //super(id ? id : uuid())
    super(id ? id: new ObjectId(id))
  }

  /**
   * To convert the value to an ObjectId
   */
  toObjectId(): ObjectId {
    return new ObjectID(super.toValue())
  }

}
