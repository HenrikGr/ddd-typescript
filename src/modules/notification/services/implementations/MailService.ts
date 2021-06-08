/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { ServiceLogger } from '@hgc-sdk/logger'
import { createTransport, Transporter, SendMailOptions } from 'nodemailer'
import { Transport, TransportOptions } from 'nodemailer'
import * as SMTPTransport from 'nodemailer/lib/smtp-transport'
import * as SMTPPool from 'nodemailer/lib/smtp-pool'
import * as SendmailTransport from 'nodemailer/lib/sendmail-transport'
import * as StreamTransport from 'nodemailer/lib/stream-transport'
import * as JSONTransport from 'nodemailer/lib/json-transport'
import * as SESTransport from 'nodemailer/lib/ses-transport'

/**
 * Available transport options
 */
export type Options =
  | SMTPTransport.Options
  | SMTPPool.Options
  | SendmailTransport.Options
  | StreamTransport.Options
  | JSONTransport.Options
  | SESTransport.Options
  | TransportOptions

/**
 * Available transport types
 */
export type TransportType =
  | Options
  | SMTPTransport
  | SMTPPool
  | SendmailTransport
  | StreamTransport
  | JSONTransport
  | SESTransport
  | Transport
  | string

/**
 * Mail service interface
 */
export interface IMailService {
  sendMail(options: SendMailOptions): Promise<any>
}

/**
 * Implementation of mail service using nodemailer.
 */
export class MailService implements IMailService {
  /**
   * Transporter object that can send mail to mail services
   * @private
   */
  private transporter: Transporter

  /**
   * Service logger
   * @private
   */
  private logger: ServiceLogger

  /**
   * Creates a new instance
   * @param options
   * @param logger
   */
  constructor(options: Options, logger: ServiceLogger) {
    this.transporter = createTransport(options)
    this.logger = logger

    /**
     * Verify transporter connection
     */
    this.transporter.verify((error) => {
      if (error) {
        this.logger.error(error)
      } else {
        this.logger.info('Mail transporter is ready.')
      }
    })
  }

  /**
   * Send a message
   * @param options
   */
  public async sendMail(options: SendMailOptions): Promise<any> {
    const { from, to, subject, html } = options

    let message = {
      to: to,
      from: from,
      subject: subject,
      text: 'plain text',
      /*
      html:
        '<p><b>Hello</b> to myself <img src="cid:note@example.com"/></p>' +
        "<p>Here's a nyan cat for you as an embedded attachment:<br/>" +
        '<img src="cid:nyan@example.com"/></p>',

       */
    }

    this.transporter.sendMail(message, (error, info) => {
      if (error) {
        this.logger.error('sendMail: ', error.message)
        return process.exit(1)
      }

      this.logger.info('Message sent successfully!')

      // only needed when using pooled connections
      // this.transporter.close()
    })
  }
}
