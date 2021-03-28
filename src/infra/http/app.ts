/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */
// @ts-nocheck
import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import { v1Router } from './routes/v1'
import { appConfig } from './appConfig'

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors("*"))
app.use(compression())
app.use(helmet())
app.use(morgan('combined'))

//run().catch(err => console.log(err.name, err.message))

app.get('/status', (req, res) => {
  return res.json({ message: "OK" });
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
  return res.status(404).json({message: error.toString()})
})

app.listen(appConfig.port, () => {
  console.log(`${appConfig.appName}: Listening on port ${appConfig.port}`)
})
