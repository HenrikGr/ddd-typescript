/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { createClientLogger } from '@hgc-sdk/logger'
import { baseDao } from '../../../infra/database'
import { UsersEventSubscriber } from "./UsersEventSubscriber"
import { MongoEventDao } from '../infra/database/implementations/MongoEventDao'
import { SaveAuditData } from '../useCases/saveAuditData'

const eventDao = new MongoEventDao(baseDao, createClientLogger('EventDao'))
const saveAudit = new SaveAuditData(eventDao)

// Subscribers
new UsersEventSubscriber(saveAudit, createClientLogger('UsersEventSubscriber'))
