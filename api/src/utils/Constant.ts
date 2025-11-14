import { randomBytes } from 'crypto'
import { appendFileSync, existsSync, readFileSync, writeFileSync } from 'fs'
import { parse } from 'human-format'

export const TG_CREDS = {
  apiId: Number(process.env.TG_API_ID),
  apiHash: process.env.TG_API_HASH
}

// export const COOKIE_AGE = 3.154e+12
export const COOKIE_AGE = 54e6

export const CONNECTION_RETRIES = 10

export const PROCESS_RETRY = 50

export const CACHE_FILES_LIMIT = parse(process.env.CACHE_FILES_LIMIT || '20GB')

// Generate or read JWT secrets
// Priority: Environment variables > keys file > random generation
let apiSecret: string
let filesSecret: string

if (process.env.API_JWT_SECRET && process.env.FILES_JWT_SECRET) {
  // Use environment variables (recommended for Vercel/production)
  apiSecret = process.env.API_JWT_SECRET
  filesSecret = process.env.FILES_JWT_SECRET
} else {
  // Fallback to keys file for local development
  const keysPath = `${__dirname}/../../keys`
  const keys = existsSync(keysPath) ? readFileSync(keysPath, 'utf-8') : null
  const [keyApiSecret, keyFilesSecret] = keys?.toString()?.split('\n') || [
    randomBytes(48).toString('base64'),
    randomBytes(48).toString('base64')
  ]

  apiSecret = process.env.API_JWT_SECRET || keyApiSecret
  filesSecret = process.env.FILES_JWT_SECRET || keyFilesSecret

  // Only write to file if not in serverless environment
  if (!process.env.VERCEL && !process.env.AWS_LAMBDA_FUNCTION_NAME) {
    if (!process.env.API_JWT_SECRET) {
      writeFileSync(keysPath, apiSecret)
    }
    if (!process.env.FILES_JWT_SECRET) {
      appendFileSync(keysPath, `\n${filesSecret}`)
    }
  }
}

export const API_JWT_SECRET = apiSecret
export const FILES_JWT_SECRET = filesSecret