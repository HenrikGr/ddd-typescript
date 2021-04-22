import { strict as assert } from 'assert'
import fs from 'fs'


export function loadServerCerts() {
  assert(process.env.SERVER_KEY_FILE, 'process.env.SERVER_KEY_FILE missing')
  assert(process.env.SERVER_CERT_FILE, 'process.env.SERVER_CERT_FILE missing')
  const key = fs.readFileSync(process.env.SERVER_KEY_FILE, 'utf-8')
  const cert = fs.readFileSync(process.env.SERVER_CERT_FILE, 'utf-8')

  return { key, cert}
}
