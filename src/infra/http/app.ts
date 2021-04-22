/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import * as https from 'https'
import express from 'express'
import { v1Router } from './routes/v1'
import { appConfig } from './config'
import { loadExpressMiddleware } from './middleware'
import { loadServerCerts } from './security'

const { key, cert } = loadServerCerts()
const { port, appName } = appConfig
const HOST = `${appName}:${port}`

const app = express()

loadExpressMiddleware(app)

app.get('/', (req, res) => {
  return res.json({ status: 'OK' })
})

app.use('/api/v1', v1Router)

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!err) {
    return next()
  }
  return res.status(500).json({ message: err.toString() })
})

app.use('*', (req: express.Request, res: express.Response) => {
  const error = new Error('Resource not found')
  return res.status(404).json({ message: error.toString() })
})

https.createServer({ key, cert }, app).listen(appConfig.port, () => {
  console.log(`Listening on: ${HOST}`)
})
