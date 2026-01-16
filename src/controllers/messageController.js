// Controller de mensagens
// Manipula requisições HTTP relacionadas a mensagens

import messageService from '../services/messageService.js'

export async function createMessage(req, res) {
  try {
    const { conversationId, senderType, senderId, content } = req.body

    if (!conversationId || !senderType || !senderId || !content) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' })
    }

    if (!['user', 'agent', 'ai'].includes(senderType)) {
      return res.status(400).json({ error: 'senderType inválido' })
    }

    const message = await messageService.createMessage(
      conversationId,
      senderType,
      senderId,
      content
    )

    res.status(201).json(message)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function getConversationMessages(req, res) {
  try {
    const { conversationId } = req.params

    const messages =
      await messageService.getMessagesByConversation(conversationId)

    res.json(messages)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function markAsRead(req, res) {
  try {
    const { messageId } = req.params

    const message = await messageService.markMessageAsRead(messageId)

    res.json(message)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function markConversationAsRead(req, res) {
  try {
    const { conversationId, userId } = req.body

    if (!conversationId || !userId) {
      return res
        .status(400)
        .json({ error: 'conversationId e userId são obrigatórios' })
    }

    const result = await messageService.markConversationMessagesAsRead(
      conversationId,
      userId
    )

    res.json({ count: result.count })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function getUnreadCount(req, res) {
  try {
    const { userId, userType } = req.query

    if (!userId || !userType) {
      return res
        .status(400)
        .json({ error: 'userId e userType são obrigatórios' })
    }

    if (!['user', 'agent'].includes(userType)) {
      return res.status(400).json({ error: 'userType inválido' })
    }

    const count = await messageService.getUnreadMessageCount(userId, userType)

    res.json({ count })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export default {
  createMessage,
  getConversationMessages,
  markAsRead,
  markConversationAsRead,
  getUnreadCount,
}
