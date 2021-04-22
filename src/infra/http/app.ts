/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */
// @ts-nocheck
import { strict as assert } from 'assert'
import * as fs from 'fs'
import * as https from 'https'
import express from 'express'
import session from 'express-session'
import passport from 'passport'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import { v1Router } from './routes/v1'
import { appConfig } from './appConfig'

assert(process.env.SERVER_KEY_FILE, 'process.env.SERVER_KEY_FILE missing')
assert(process.env.SERVER_CERT_FILE, 'process.env.SERVER_CERT_FILE missing')
const key = fs.readFileSync(process.env.SERVER_KEY_FILE, 'utf-8')
const cert = fs.readFileSync(process.env.SERVER_CERT_FILE, 'utf-8')
const { port, appName } = appConfig
const HOST = `${appName}:${port}`

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors('*'))
app.use(compression())
app.use(helmet())
app.use(morgan('combined'))

app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: 'secret',
  })
)

app.use(passport.initialize())
app.use(passport.session())

app.get('/status', (req, res) => {
  return res.json({ message: 'OK' })
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
