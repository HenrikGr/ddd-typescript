import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { userDao } from '../../../infra/database'
import { IUserDao } from '../../../infra/database/implementations/MongoUserDao'
import { ISessionDao } from '../../../infra/database/implementations/MongoSessionDao'



class Authentication {

  constructor(userDao: IUserDao, sessionDao: ISessionDao) {

  }


  getPassportInstance() {
    return passport
  }
}
