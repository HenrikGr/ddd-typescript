/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { ServiceLogger } from '@hgc-sdk/logger'
import { NextFunction, Request, Response } from 'express'

/**
 * Express error handler
 */
export class ErrorHandler {
  private logger: ServiceLogger
  constructor(logger: ServiceLogger) {
    this.logger = logger
  }

  handleInternalServerError = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (!err) {
      return next()
    }

    this.logger.error('500', {
      method: req.method,
      url: req.originalUrl,
      query: req.query,
      ip: req.ip,
      error: err,
      stack: err.stack,
    })

    return res.status(500).json({ message: err.toString() })
  }

  handleNotFound = (req: Request, res: Response) => {
    const error = new Error('Resource not found')

    this.logger.error('404', {
      method: req.method,
      url: req.originalUrl,
      query: req.query,
      ip: req.ip,
    })

    return res.status(404).json({ message: error.toString() })
  }

  handleExceptions = (error: any) => {
    this.logger.info(`Exception`, {
      method: '',
      url: '',
      query: '',
      ip: '',
      error: error,
      stack: ``,
    })

    process.exit(1)
  }

  handleServerExit = (signal: string, server: any) => {
    return () => {
      this.logger.info(`${signal} received! shutting down`)
      this.logger.info(`${signal}`, {
        method: '',
        url: '',
        query: '',
        ip: '',
        error: `${signal} received`,
        stack: `shutting down`,
      })
      server.close(() => {
        process.exit(0)
      })
    }
  }
}
