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
import { loadServerCerts } from './certificates'
import { errorHandler } from './errorHandler'

const { key, cert } = loadServerCerts()
const { port, appName } = appConfig
const HOST = `${appName}:${port}`

/**
 * Start express server
 */
async function startServer() {

  // Create an express app
  const app = express()

  // Load express middlewares
  loadExpressMiddleware(app, appConfig)

  // Ping endpoint
  app.get('/ping', (req, res) => {
    return res.status(200).json({ status: 'OK' })
  })

  // API routes
  app.use('/api/v1', v1Router)

  // Internal error
  app.use(errorHandler.handleInternalServerError)

  // Not found error
  app.use('*', errorHandler.handleNotFound)

  // Create https server
  const server = https.createServer({ key, cert }, app).listen(appConfig.port, () => {
    console.log(`Listening on: ${HOST}`)
  })

  // Gracefully shut down
  process.on('unhandledRejection', errorHandler.handleExceptions)
  process.on('uncaughtException', errorHandler.handleExceptions)
  process.on('SIGINT', errorHandler.handleServerExit('SIGINT', server))
  process.on('SIGTERM', errorHandler.handleServerExit('SIGTERM', server))
}

startServer().catch((error) => console.log('Could not start server: ', error.message))
