// Serviço principal de WebSocket
// Gerencia conexões em tempo real para chat entre usuários e agentes

import { Server } from 'socket.io'
import { getConfig } from '../config/index.js'
import connectionManager from './connectionManager.js'
import monitorService from './monitorService.js'
import { getPrismaClient } from '../config/database.js'

const prisma = getPrismaClient()

class WebSocketService {
  constructor() {
    this.io = null
    this.config = getConfig()
  }

  initialize(server) {
    this.io = new Server(server, {
      path: this.config.websocket.path,
      cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
      },
      pingTimeout: this.config.websocket.pingTimeout,
      pingInterval: this.config.websocket.pingInterval,
    })

    this.setupEventHandlers()
    monitorService.logEvent('INITIALIZED', {
      message: 'Serviço WebSocket iniciado',
    })

    return this.io
  }

  setupEventHandlers() {
    this.io.on('connection', (socket) => this.handleConnection(socket))

    this.io.use(async (socket, next) => {
      try {
        const { type, id } = socket.handshake.auth

        if (!type || !id) {
          throw new Error('Autenticação não fornecida')
        }

        if (type === 'agent') {
          const agent = await prisma.agent.findUnique({
            where: { id },
          })

          if (!agent || !agent.isActive) {
            throw new Error('Agente não encontrado ou inativo')
          }
        }

        next()
      } catch (error) {
        next(new Error(error.message))
      }
    })
  }

  async handleConnection(socket) {
    const { type, id } = socket.handshake.auth

    connectionManager.addConnection(socket.id, id, type)
    monitorService.logConnection(socket.id, type, id)

    socket.emit('connected', {
      message: 'Conectado ao servidor de chat',
      socketId: socket.id,
    })

    if (type === 'agent') {
      this.setupAgentHandlers(socket, id)
    } else {
      this.setupUserHandlers(socket, id)
    }

    socket.on('disconnect', () => this.handleDisconnection(socket, type, id))

    socket.on('error', (error) => {
      monitorService.logError(error, { socketId: socket.id, type, id })
    })
  }

  handleDisconnection(socket, type, id) {
    connectionManager.removeConnection(socket.id)
    monitorService.logDisconnection(socket.id, type, id)
  }

  setupUserHandlers(socket, userId) {
    socket.on('send_message', async (data) =>
      this.handleUserMessage(socket, userId, data)
    )

    socket.on('create_conversation', async (data) =>
      this.handleCreateConversation(socket, userId, data)
    )

    socket.on('get_conversations', async () =>
      this.handleGetConversations(socket, userId)
    )
  }

  setupAgentHandlers(socket, agentId) {
    socket.on('send_message', async (data) =>
      this.handleAgentMessage(socket, agentId, data)
    )

    socket.on('assign_conversation', async (data) =>
      this.handleAssignConversation(socket, agentId, data)
    )

    socket.on('get_conversations', async () =>
      this.handleGetAllConversations(socket)
    )

    socket.on('get_active_users', async () =>
      socket.emit('active_users', connectionManager.getOnlineUsers())
    )
  }

  async handleCreateConversation(socket, userId, data) {
    try {
      const { subject } = data

      const conversation = await prisma.conversation.create({
        data: {
          userId,
          status: 'open',
          subject,
        },
        include: {
          user: true,
        },
      })

      socket.emit('conversation_created', conversation)

      this.broadcastToAgents('new_conversation', conversation)

      monitorService.logEvent('CONVERSATION_CREATED', {
        conversationId: conversation.id,
        userId,
      })
    } catch (error) {
      socket.emit('error', { message: error.message })
      monitorService.logError(error, { userId, action: 'create_conversation' })
    }
  }

  async handleUserMessage(socket, userId, data) {
    try {
      const { conversationId, content } = data

      const message = await prisma.message.create({
        data: {
          conversationId,
          senderType: 'user',
          senderId: userId,
          content,
        },
      })

      monitorService.logMessage(message, 'SENT')

      socket.emit('message_sent', message)

      const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: { agent: true },
      })

      if (conversation?.agentId) {
        this.sendToAgent(conversation.agentId, 'new_message', message)
      } else {
        this.broadcastToAgents('new_message', message)
      }
    } catch (error) {
      socket.emit('error', { message: error.message })
      monitorService.logError(error, { userId, action: 'send_message' })
    }
  }

  async handleAgentMessage(socket, agentId, data) {
    try {
      const { conversationId, content } = data

      const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
      })

      if (!conversation) {
        throw new Error('Conversa não encontrada')
      }

      if (conversation.agentId && conversation.agentId !== agentId) {
        throw new Error('Esta conversa está sendo atendida por outro agente')
      }

      const message = await prisma.message.create({
        data: {
          conversationId,
          senderType: 'agent',
          senderId: agentId,
          content,
        },
        include: {
          conversation: {
            include: {
              user: true,
            },
          },
        },
      })

      monitorService.logMessage(message, 'SENT')

      socket.emit('message_sent', message)

      this.sendToUser(conversation.userId, 'new_message', message)
    } catch (error) {
      socket.emit('error', { message: error.message })
      monitorService.logError(error, { agentId, action: 'send_message' })
    }
  }

  async handleAssignConversation(socket, agentId, data) {
    try {
      const { conversationId } = data

      const conversation = await prisma.conversation.update({
        where: { id: conversationId },
        data: {
          agentId,
          status: 'in_progress',
          assignedAt: new Date(),
        },
        include: {
          user: true,
        },
      })

      socket.emit('conversation_assigned', conversation)

      this.broadcastToAgents('conversation_updated', conversation)

      this.sendToUser(
        conversation.userId,
        'conversation_assigned',
        conversation
      )

      monitorService.logEvent('CONVERSATION_ASSIGNED', {
        conversationId,
        agentId,
        userId: conversation.userId,
      })
    } catch (error) {
      socket.emit('error', { message: error.message })
      monitorService.logError(error, { agentId, action: 'assign_conversation' })
    }
  }

  async handleGetConversations(socket, userId) {
    try {
      const conversations = await prisma.conversation.findMany({
        where: { userId },
        include: {
          agent: true,
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
        orderBy: { updatedAt: 'desc' },
      })

      socket.emit('conversations', conversations)
    } catch (error) {
      socket.emit('error', { message: error.message })
      monitorService.logError(error, { userId, action: 'get_conversations' })
    }
  }

  async handleGetAllConversations(socket) {
    try {
      const conversations = await prisma.conversation.findMany({
        include: {
          user: true,
          agent: true,
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
        orderBy: { updatedAt: 'desc' },
      })

      socket.emit('conversations', conversations)
    } catch (error) {
      socket.emit('error', { message: error.message })
      monitorService.logError(error, { action: 'get_all_conversations' })
    }
  }

  sendToUser(userId, event, data) {
    const sockets = connectionManager.getUserSockets(userId)
    sockets.forEach((socketId) => {
      this.io.to(socketId).emit(event, data)
    })
  }

  sendToAgent(agentId, event, data) {
    const sockets = connectionManager.getAgentSockets(agentId)
    sockets.forEach((socketId) => {
      this.io.to(socketId).emit(event, data)
    })
  }

  broadcastToAgents(event, data) {
    const agentIds = connectionManager.getOnlineAgents()
    agentIds.forEach((agentId) => {
      this.sendToAgent(agentId, event, data)
    })
  }

  broadcastToAll(event, data) {
    this.io.emit(event, data)
  }

  getConnectionStats() {
    return connectionManager.getAllConnections()
  }
}

export default new WebSocketService()
