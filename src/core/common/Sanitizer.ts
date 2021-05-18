import validator from 'validator'
import { JSDOM } from 'jsdom'
import DOMPurify from 'dompurify'
const { window } = new JSDOM('<!DOCTYPE html>')
const domPurify = DOMPurify(window)

/**
 * Implementation of sanitizer methods mostly needed to provide protection
 */
export class Sanitizer {

  /**
   * Purify text and sanitize against XSS attacks.
   * @param unsafeText
   */
  public static sanitize(unsafeText: string): string {
    return domPurify.sanitize(unsafeText)
  }

  public static validateWebURL(url: string): boolean {
    return validator.isURL(url)
  }
}
