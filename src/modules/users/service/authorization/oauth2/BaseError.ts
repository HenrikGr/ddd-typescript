/**
 * HTTP Status codes
 */
export enum HttpStatusCode {
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  GONE = 410,
  INTERNAL_SERVER = 500,
}

/**
 * BaseError class
 */
class BaseError extends Error {
  public readonly name: string
  public readonly httpCode: HttpStatusCode
  public readonly isOperational: boolean

  /**
   * Create a new BaseError instance
   * @param {string} name
   * @param {string} message
   * @param {HttpStatusCode} httpCode
   * @param {boolean} isOperational
   */
  constructor(name: string, message: string, httpCode: HttpStatusCode, isOperational: boolean) {
    super(message)
    Object.setPrototypeOf(this, new.target.prototype)

    this.name = name
    this.httpCode = httpCode
    this.isOperational = isOperational

    Error.captureStackTrace(this)
  }
}

/**
 * This response means that server could not understand the request
 * due to invalid syntax.
 */
export class BadRequest extends BaseError {
  constructor(message: string) {
    super('BadRequest', message, 400, false)
  }
}

/**
 * The client must authenticate itself to get the requested response.
 */
export class Unauthorized extends BaseError {
  constructor(message: string) {
    super('Unauthorized', message, 401, false)
  }
}

/**
 * The client does not have access rights to the content, i.e. they are unauthorized,
 * so server is rejecting to give proper response. Unlike 401, the client's identity
 * is known to the server
 */
export class Forbidden extends BaseError {
  constructor(message: string) {
    super('Forbidden', message, 403, false)
  }
}

/**
 * The server can not find requested resource. In the browser, this means the URL is
 * not recognized. In an API, this can also mean that the endpoint is valid but the
 * resource itself does not exist. Servers may also send this response instead of
 * Forbidden to hide the existence of a resource from an unauthorized client.
 */
export class NotFound extends BaseError {
  constructor(message: string) {
    super('NotFound', message, 404, false)
  }
}

/**
 * This response is sent when a request conflicts with the current state of the server.
 */
export class Conflict extends BaseError {
  constructor(message: string) {
    super('Conflict', message, 409, false)
  }
}

/**
 * This response would be sent when the requested content has been permanently
 * deleted from server, with no forwarding address. Clients are expected to
 * remove their caches and links to the resource. The HTTP specification intends
 * this status code to be used for "limited-time, promotional services".
 * APIs should not feel compelled to indicate resources that have been deleted
 * with this status code.
 */
export class Gone extends BaseError {
  constructor(message: string) {
    super('Gone', message, 410, false)
  }
}

/**
 * The server has encountered a situation it doesn't know how to handle.
 */
export class UnexpectedError extends BaseError {
  constructor(message: string) {
    super('UnexpectedError', message, 500, true)
  }
}
