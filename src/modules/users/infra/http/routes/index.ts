/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import express from 'express'
import { signUpUserController } from '../../../useCases/signUpUser'
import { deleteUserController } from '../../../useCases/deleteUser'
import { signInUserController} from '../../../useCases/signInUser'

//import { getUserByUserNameController } from '../../../useCases/getUserByUserName';
//import { loginController } from '../../../useCases/login';
//import { middleware } from '../../../../../shared/infra/http';
//import { getCurrentUserController } from '../../../useCases/getCurrentUser';
//import { refreshAccessTokenController } from '../../../useCases/refreshAccessToken';
//import { logoutController } from '../../../useCases/logout';

const userRouter = express.Router()

userRouter.post('/', (req, res) => signUpUserController.executeImpl(req, res))
userRouter.post('/login', (req, res) => signInUserController.execute(req, res))
userRouter.delete('/:username', (req, res) => deleteUserController.executeImpl(req, res))




/*
userRouter.get('/me',
  middleware.ensureAuthenticated(),
  (req, res) => getCurrentUserController.execute(req, res)
)

userRouter.post('/login',
  (req, res) => loginController.execute(req, res)
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
