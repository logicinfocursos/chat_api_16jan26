// Controller de conversas
// Manipula requisições HTTP relacionadas a conversas

import conversationService from '../services/conversationService.js'

export async function createConversation(req, res) {
  try {
    const { userId, subject } = req.body

    if (!userId) {
      return res.status(400).json({ error: 'userId é obrigatório' })
    }

    const conversation = await conversationService.createConversation(
      userId,
      subject
    )

    res.status(201).json(conversation)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function getUserConversations(req, res) {
  try {
    const { userId } = req.params

    const conversations =
      await conversationService.getConversationsByUser(userId)

    res.json(conversations)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function getAllConversations(req, res) {
  try {
    const { status } = req.query

    let conversations

    if (status) {
      conversations = await conversationService.getConversationsByStatus(status)
    } else {
      conversations = await conversationService.getAllConversations()
    }

    res.json(conversations)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function getConversation(req, res) {
  try {
    const { id } = req.params

    const conversation = await conversationService.getConversationById(id)

    if (!conversation) {
      return res.status(404).json({ error: 'Conversa não encontrada' })
    }

    res.json(conversation)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function updateConversationStatus(req, res) {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!['open', 'in_progress', 'closed'].includes(status)) {
      return res.status(400).json({ error: 'Status inválido' })
    }

    const conversation = await conversationService.updateConversationStatus(
      id,
      status
    )

    res.json(conversation)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function assignAgent(req, res) {
  try {
    const { conversationId, agentId } = req.body

    if (!conversationId || !agentId) {
      return res
        .status(400)
        .json({ error: 'conversationId e agentId são obrigatórios' })
    }

    const conversation = await conversationService.assignAgentToConversation(
      conversationId,
      agentId
    )

    res.json(conversation)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export default {
  createConversation,
  getUserConversations,
  getAllConversations,
  getConversation,
  updateConversationStatus,
  assignAgent,
}
