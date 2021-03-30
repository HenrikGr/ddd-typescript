
const { ResourceOwnerPassword } = require('simple-oauth2')
import { ClientConfigurationReader } from './ClientConfigurationReader'

const config = ClientConfigurationReader.readEnvironment()
const oAuthClient = new ResourceOwnerPassword(config)

export {
  oAuthClient
}
