// Módulo de configuração de variáveis de ambiente
// Carrega e valida as variáveis de ambiente sensíveis

import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '../../.env') })

const config = {
  port: parseInt(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  wsPath: process.env.WS_PATH || '/socket.io',
}

export function validateEnv() {
  const required = ['JWT_SECRET', 'DATABASE_URL']
  const missing = required.filter((key) => !process.env[key])

  if (missing.length > 0) {
    throw new Error(
      `Variáveis de ambiente obrigatórias não definidas: ${missing.join(', ')}`
    )
  }

  return config
}

export default config
