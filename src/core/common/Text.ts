import validator from 'validator'
import { JSDOM } from 'jsdom'
import DOMPurify from 'dompurify'
const { window } = new JSDOM('<!DOCTYPE html>')
const domPurify = DOMPurify(window)

export class Text {
  public static sanitize(unsafeText: string): string {
    return domPurify.sanitize(unsafeText)
  }

  public static validateWebURL(url: string): boolean {
    return validator.isURL(url)
  }
}
