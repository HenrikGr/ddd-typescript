/**
 * @prettier
 * @copyright (c) 2021 - present, Henrik Grönvall Consulting AB
 * @licence This source code is licensed under the MIT license described
 * and found in the LICENSE file in the root directory of this source tree.
 */

import { Express } from 'express'
import { json, urlencoded, OptionsJson, OptionsUrlencoded } from 'body-parser'

/**
 * JSON Body parser options
 */
const jsonOptions: OptionsJson = {
  inflate: true,  // Deflated (compressed) bodies will be inflated (de-compressed).
  limit: '100kb', // Controls the maximum request body size.
  strict: true,   // When set to true, only accept arrays and objects.
  type: 'application/json', // The media type the middleware will parse.
}

/**
 * UrlEncoded body parser
 */
const urlEncodedOptions: OptionsUrlencoded = {
  extended: true,       // Uses the qs library
  parameterLimit: 1000  // Controls the maximum number of parameters that are allowed in the URL-encoded data
}

/**
 * Apply body parser for express app
 * @param app
 */
export function applyBodyParser(app: Express) {

  /**
   * Returns middleware that only parses json and only looks at requests where the
   * Content-Type header matches the type option.
   */
  app.use(json(jsonOptions))

  /**
   * Returns middleware that only parses urlencoded bodies and only looks at requests
   * where the Content-Type header matches the type option.
   */
  app.use(urlencoded(urlEncodedOptions))
}

