
import { DbClient, DbClientConfiguration } from '@hgc-sdk/mongo-db'

const connectionOpts = DbClientConfiguration.create()
const dbClient = DbClient.create(connectionOpts)

export {
  dbClient
}
