/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { createClientLogger } from '@hgc-sdk/logger'
import { baseDao } from '../../../../infra/database'
import { MongoUserDao } from './implementations/MongoUserDao'

export const userDao = new MongoUserDao(baseDao, createClientLogger('UserDao'))

