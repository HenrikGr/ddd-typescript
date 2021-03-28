/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import express from 'express'
import { userRouter } from '../../../modules/users/infra/http/routes'

const v1Router = express.Router();

v1Router.use('/users', userRouter)

export { v1Router }
