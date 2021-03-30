
import { ClientConfigurationReader} from '../../modules/users/service/OAuth/ClientConfigurationReader'

const { ClientCredentials, ResourceOwnerPassword, AuthorizationCode } = require('simple-oauth2');

const config = ClientConfigurationReader.readEnvironment()

async function run() {
  const client = new ResourceOwnerPassword(config);
  const tokenParams = {
    username: 'root-user',
    password: 'Hgc9057AB',
    scope: '',
  }

  const EXPIRATION_WINDOW_IN_SECONDS = 300; // Window of time before the actual expiration to refresh the token

  try {
    let accessToken = await client.getToken(tokenParams);
    console.log('AccessToken received: ', accessToken)

    /**
     * Serialize and deserialize if we need to persist token
     * You can create a new token with methods from database
     */
    const accessTokenJSONString = JSON.stringify(accessToken);
    // console.log('JSON string to persist', accessTokenJSONString)
    //
    accessToken = client.createToken(JSON.parse(accessTokenJSONString));
    // console.log('AccessToken instance: ', accessToken)

    const refreshParams = {
      scope: 'profile',
    };

    if (accessToken.expired(EXPIRATION_WINDOW_IN_SECONDS)) {
      try {
        accessToken = await accessToken.refresh()
        console.log('AccessToken received after refresh: ', accessToken)
      } catch (error) {
        console.log('Error refreshing access token: ', error.output);
      }
    }

    // accessToken = await accessToken.refresh(refreshParams);
    // console.log('AccessToken received after refresh: ', accessToken)

    //await accessToken.revokeAll()
    await accessToken.revoke('access_token');
    await accessToken.revoke('refresh_token');
    console.log('Finish:')

  } catch (error) {
    console.log('Access Token Error', error.output)
  }
}

export {
  run
}
