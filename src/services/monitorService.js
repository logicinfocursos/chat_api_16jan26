// Serviço de Monitoramento em Tempo Real
// Loga todas as mensagens enviadas e recebidas via WebSocket

import { getConfig } from '../config/index.js'

class MonitorService {
  constructor() {
    this.isEnabled = getConfig().monitoring?.enabled ?? true
    this.messages = []
    this.maxMessages = 100
  }

  log(type, data) {
    if (!this.isEnabled) return

    const timestamp = new Date().toISOString()
    const logData = {
      timestamp,
      type,
      ...data,
    }

    console.log('📡 MONITOR:', JSON.stringify(logData, null, 2))
  }

  logConnection(socketId, userType, userId) {
    this.log('CONNECTION', {
      socketId,
      userType,
      userId,
      message: `${userType} conectado: ${userId}`,
    })
  }

  logDisconnection(socketId, userType, userId) {
    this.log('DISCONNECTION', {
      socketId,
      userType,
      userId,
      message: `${userType} desconectado: ${userId}`,
    })
  }

  logMessage(message, direction) {
    const messageData = {
      timestamp: new Date().toISOString(),
      direction,
      conversationId: message.conversationId,
      senderType: message.senderType,
      senderId: message.senderId,
      content: message.content,
      isRead: message.isRead,
      messageId: message.id,
    }

    this.messages.unshift(messageData)

    if (this.messages.length > this.maxMessages) {
      this.messages = this.messages.slice(0, this.maxMessages)
    }

    this.log('MESSAGE', {
      direction,
      conversationId: message.conversationId,
      senderType: message.senderType,
      content: message.content,
    })
  }

  logError(error, context) {
    this.log('ERROR', {
      error: error.message,
      context,
    })
  }

  logEvent(event, data) {
    this.log('EVENT', {
      event,
      data,
    })
  }

  getMessages() {
    return this.messages
  }

  clearMessages() {
    this.messages = []
  }
}

export default new MonitorService()
