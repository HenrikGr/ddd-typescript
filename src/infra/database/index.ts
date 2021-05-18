/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { BaseDao, DbClient, DbClientConfiguration } from '@hgc-sdk/mongo-db'

export const connectionOpts = DbClientConfiguration.create()
export const dbClient = DbClient.create(connectionOpts)
export const baseDao = new BaseDao('UserDb', dbClient)
