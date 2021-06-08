/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import express from 'express'
import { signUpController } from '../../../useCases/signUpUser'
import { deleteUserController } from '../../../useCases/deleteUser'
import { signInController } from '../../../useCases/signInUser'
//import { getCurrentUserController } from '../../../useCases/getCurrentUser';
//import { refreshAccessTokenController } from '../../../useCases/refreshAccessToken';
//import { logoutController } from '../../../useCases/logout';
import { middleware } from '../middleware'

/**
 * User resource router
 */
const userRouter = express.Router()

/**
 * Sign up user to the application service
 */
userRouter.post('/signup', (req, res, next) => signUpController.execute(req, res, next))

/**
 * Sign in, create user account
 */
userRouter.post('/signin', (req, res, next) => signInController.execute(req, res, next))

/**
 * Delete user account
 */
userRouter.delete('/:username', (req, res, next) =>  deleteUserController.execute(req, res, next))

/*
userRouter.get('/me',
  middleware.ensureAuthenticated(),
  (req, res) => getCurrentUserController.execute(req, res)
)

userRouter.post('/logout',
  middleware.ensureAuthenticated(),
  (req, res) => logoutController.execute(req, res)
)

userRouter.post('/token/refresh',
  (req, res) => refreshAccessTokenController.execute(req, res)
)

userRouter.delete('/:userId',
  middleware.ensureAuthenticated(),
  (req, res) => deleteUserController.execute(req, res)
)

userRouter.get('/:username',
  middleware.ensureAuthenticated(),
  (req, res) => getUserByUserNameController.execute(req, res)
)
*/

export { userRouter }
