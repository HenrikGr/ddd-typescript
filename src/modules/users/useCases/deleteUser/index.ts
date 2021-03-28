/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { DeleteUser } from "./DeleteUser";
import { DeleteUserController } from "./DeleteUserController";
import { userRepo }  from '../../repos'

const deleteUserController = new DeleteUserController(new DeleteUser(userRepo))

/**
 * Export the use case controller.
 * Should be imported to the modules infrastructure
 * component managing route mappings.
 */
export {
  deleteUserController
}
