/**
 * @prettier
 * @copyright (c) 2020 - present, HGC-AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { ServiceLogger } from '@hgc-sdk/logger'
import { IBaseDao } from '@hgc-sdk/mongo-db'
import { CreateUserDTO } from '../../../dtos/CreateUserDTO'
import { UpdateUserDTO } from '../../../dtos/UpdateUserDTO'

export interface IUserDao {
  list(limit: number, page: number): Promise<any>
  exist(userName: string, email?: string): Promise<any>
  getUserByUserName(userName: string): Promise<any>
  createUser(dto: CreateUserDTO): Promise<any>
  updateUserByUserName(userName: string, dto: UpdateUserDTO): Promise<any>
  deleteUserByUserName(username: string): Promise<any>
}

export class UserDao implements IUserDao {
  private dao: IBaseDao
  private logger: ServiceLogger
  private readonly collectionName: string

  /**
   * Creates a new UserModel instance
   * @param logger
   * @param dao
   * @param collectionName
   */
  public constructor(dao: IBaseDao, logger: ServiceLogger, collectionName?: string) {
    this.dao = dao
    this.logger = logger
    this.collectionName = collectionName ? collectionName : 'accounts'
  }

  list(limit: number, page: number): Promise<any> {
    return Promise.resolve(undefined)
  }

  exist(userName: string, userEmail?: string): Promise<any> {
    this.logger.verbose('exist: ', userName, userEmail)

    try {
      let filter = {}
      if (userEmail) {
        filter = { $or: [{ username: userName }, { email: userEmail }] }
      } else {
        filter = { username: userName }
      }

      return this.dao.findOne(this.collectionName, filter)
    } catch (err) {
      this.logger.error('exist: ', err.name, err.message)
      throw new Error(err.message)
    }
  }

  getUserByUserName(userName: string): Promise<any> {
    this.logger.verbose('getUserByUserName: ', userName)

    try {
      let filter = { username: userName }
      return this.dao.findOne(this.collectionName, filter)
    } catch (err) {
      this.logger.error('getUserByUserName: ', err.name, err.message)
      throw new Error(err.message)
    }
  }

  getUserByUserEmail(userEmail: string): Promise<any> {
    this.logger.verbose('getUserByUserEmail: ', userEmail)

    try {
      let filter = { email: userEmail }
      return this.dao.findOne(this.collectionName, filter)
    } catch (err) {
      this.logger.error('getUserByUserName: ', err.name, err.message)
      throw new Error(err.message)
    }
  }

  createUser(dto: CreateUserDTO): Promise<any> {
    this.logger.verbose('createUser: ', JSON.stringify(dto))
    try {
      return this.dao.insertOne(this.collectionName, dto)
    } catch (err) {
      this.logger.error.log('createUser: ', err.name, err.message)
      throw new Error(err.message)
    }
  }

  updateUserByUserName(userName: string, dto: UpdateUserDTO): Promise<any> {
    this.logger.verbose('updateUserByUsername: Update user: ', userName)
    try {
      const options = { upsert: true }
      const filter = { username: userName }
      return this.dao.updateOne('accounts', filter, dto, options)
    } catch (err) {
      this.logger.error('updateUserByUsername: ', err.name, err.message)
      throw new Error(err.message)
    }
  }

  deleteUserByUserName(userName: string): Promise<any> {
    this.logger.verbose('deleteUserByUserName: ', userName)
    try {
      const filter = { username: userName }
      return this.dao.deleteOne('accounts', filter)
    } catch (error) {
      throw new Error(error.message)
    }
  }
}
