/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { ResourceOwnerPassword, ModuleOptions } from 'simple-oauth2'
import { ClientConfigurationReader } from './config/ClientConfigurationReader'

const config: ModuleOptions = ClientConfigurationReader.readEnvironment()

export const resourceOwnerClient = new ResourceOwnerPassword(config)

