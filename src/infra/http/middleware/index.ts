
import { Express } from 'express'
import { applyBodyParser } from './bodyparser'
import { applyCors } from './cors'
import { applyCompression } from './compression'
import { applyHelmet } from './helmet'
import { applySession } from './session'
import { applyLogger } from './logger'

export function loadExpressMiddleware(app: Express) {
  applyLogger(app)
  applyBodyParser(app)
  applyCors(app)
  applyCompression(app)
  applyHelmet(app)
  applySession(app)
}
