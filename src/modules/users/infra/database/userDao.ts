import { CreateUserDTO } from '../../dtos/CreateUserDTO'
import { UpdateUserDTO } from '../../dtos/UpdateUserDTO'

/**
 * User Data Access Object interface
 */
export interface IUserDao {
  list(limit: number, page: number): Promise<any>
  exist(userName: string, email?: string): Promise<any>
  getUserByUserId(id: string): Promise<any>
  getUserByUserName(userName: string): Promise<any>
  createUser(dto: CreateUserDTO): Promise<any>
  updateUserByUserName(userName: string, dto: UpdateUserDTO): Promise<any>
  deleteUserByUserName(username: string): Promise<any>
}
