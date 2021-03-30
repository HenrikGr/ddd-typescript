/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { BaseDao } from '@hgc-sdk/mongo-db'
import { dbClient } from '../../../infra/database/mongo/DbClient'
import { UserDomainEvents } from "./events/UserDomainEvents";
import { EventModel } from '../infra/database/models/EventModel'
import { MongoEventLogger } from '../infra/database/implementation/MongoEventLogger'

const dao = new BaseDao('UserDb', dbClient)

const eventModel = new EventModel(dao)
const eventLogger = new MongoEventLogger(eventModel)

// Subscribers
new UserDomainEvents(eventLogger)
