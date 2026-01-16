// Módulo de configuração JSON
// Carrega configurações que podem ser alteradas em tempo de execução

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const CONFIG_PATH = path.join(__dirname, '../../config.json')

let configCache = null

export function loadConfig() {
  if (configCache) {
    return configCache
  }

  try {
    const rawData = fs.readFileSync(CONFIG_PATH, 'utf-8')
    configCache = JSON.parse(rawData)
    return configCache
  } catch (error) {
    throw new Error(`Erro ao carregar configurações JSON: ${error.message}`)
  }
}

export function reloadConfig() {
  configCache = null
  return loadConfig()
}

export function getConfig() {
  return loadConfig()
}

export default { loadConfig, reloadConfig, getConfig }
