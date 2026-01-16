// Ponto de entrada principal da aplicação
// Inicializa servidor Express, WebSocket e configura middlewares

import express from 'express'
import { createServer } from 'http'
import cors from 'cors'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { validateEnv } from './config/env.js'
import { getPrismaClient } from './config/database.js'
import { swaggerOptions } from './config/swagger.js'
import webSocketService from './services/webSocketService.js'
import { requestLogger } from './middlewares/requestLogger.js'
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js'
import conversationService from './services/conversationService.js'
import { getMonitoringPage } from './utils/monitoringPage.js'

import userRoutes from './routes/userRoutes.js'
import agentRoutes from './routes/agentRoutes.js'
import conversationRoutes from './routes/conversationRoutes.js'
import messageRoutes from './routes/messageRoutes.js'
import monitorRoutes from './routes/monitorRoutes.js'

const prisma = getPrismaClient()

function createApp() {
  const app = express()
  const config = validateEnv()

  app.use(
    cors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    })
  )
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(requestLogger)

  const specs = swaggerJsdoc(swaggerOptions)
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))

  app.get('/', (req, res) => {
    res.json({
      name: 'Chat API',
      version: '1.0.0',
      description: 'API para sistema de chat em tempo real',
      documentation: '/api-docs',
      monitoring: '/monitor',
      websocket: '/socket.io',
    })
  })

  app.get('/monitor', (req, res) => {
    res.set('Content-Type', 'text/html')
    res.send(getMonitoringPage())
  })

  app.use('/api/users', userRoutes)
  app.use('/api/agents', agentRoutes)
  app.use('/api/conversations', conversationRoutes)
  app.use('/api/messages', messageRoutes)
  app.use('/api/monitor', monitorRoutes)

  app.use('/users', userRoutes)
  app.use('/agents', agentRoutes)
  app.use('/conversations', conversationRoutes)
  app.use('/messages', messageRoutes)

  app.use(notFoundHandler)
  app.use(errorHandler)

  const server = createServer(app)

  webSocketService.initialize(server)

  async function startServer() {
    try {
      await prisma.$connect()
      console.log('✅ Conectado ao banco de dados')

      server.listen(config.port, config.server?.host || 'localhost', () => {
        console.log(`🚀 Servidor rodando em http://localhost:${config.port}`)
        console.log(
          `📚 Documentação Swagger: http://localhost:${config.port}/api-docs`
        )
        console.log(`🔍 Monitoramento: http://localhost:${config.port}/monitor`)
        console.log(`🔌 WebSocket: ws://localhost:${config.port}/socket.io`)
      })

      setInterval(async () => {
        const closed = await conversationService.closeInactiveConversations()
        if (closed.length > 0) {
          console.log(
            `🔒 ${closed.length} conversas inativas foram fechadas automaticamente`
          )
        }
      }, 60000)
    } catch (error) {
      console.error('❌ Erro ao iniciar servidor:', error)
      process.exit(1)
    }
  }

  return { app, server, startServer }
}

const { app, server, startServer } = createApp()

startServer()

export { app, server }
