/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

export class MongoEventLogger {
  private models: any

  /**
   * Creates a new UserRepo instance
   * @param models
   */
  constructor(models: any) {
    this.models = models
  }

  public async save(event: object): Promise<void> {
    return await this.models.createDomainEvent(event)
  }
}
