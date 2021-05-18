import { UseCase } from '../../../../core/domain/UseCase'
import { Request } from '../../../../core/infra/BaseController'
import { IEventDao } from '../../infra/database/IEventDao'

export class SaveAuditData implements UseCase<Request, Promise<void>> {
  private dao: IEventDao
  constructor(dao: IEventDao) {
    this.dao = dao
  }

  async execute(event: Request): Promise<void> {
    await this.dao.create(event)
  }
}
