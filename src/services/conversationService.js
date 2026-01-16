// Serviço de conversas
// Lógica de negócio para gerenciar conversas de chat

import { getPrismaClient } from '../config/database.js'
import { getConfig } from '../config/index.js'

const prisma = getPrismaClient()
const chatConfig = getConfig().chat

export async function createConversation(userId, subject) {
  return await prisma.conversation.create({
    data: {
      userId,
      subject,
      status: 'open',
    },
    include: {
      user: true,
    },
  })
}

export async function getConversationsByUser(userId) {
  return await prisma.conversation.findMany({
    where: { userId },
    include: {
      agent: true,
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
      _count: {
        select: { messages: true },
      },
    },
    orderBy: { updatedAt: 'desc' },
  })
}

export async function getAllConversations() {
  return await prisma.conversation.findMany({
    include: {
      user: true,
      agent: true,
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
      _count: {
        select: { messages: true },
      },
    },
    orderBy: { updatedAt: 'desc' },
  })
}

export async function getConversationById(id) {
  return await prisma.conversation.findUnique({
    where: { id },
    include: {
      user: true,
      agent: true,
      messages: {
        orderBy: { createdAt: 'asc' },
      },
    },
  })
}

export async function updateConversationStatus(id, status) {
  const updateData = { status }

  if (status === 'closed') {
    updateData.closedAt = new Date()
  }

  return await prisma.conversation.update({
    where: { id },
    data: updateData,
    include: {
      user: true,
      agent: true,
    },
  })
}

export async function assignAgentToConversation(conversationId, agentId) {
  return await prisma.conversation.update({
    where: { id: conversationId },
    data: {
      agentId,
      status: 'in_progress',
      assignedAt: new Date(),
    },
    include: {
      user: true,
      agent: true,
    },
  })
}

export async function getConversationsByStatus(status) {
  return await prisma.conversation.findMany({
    where: { status },
    include: {
      user: true,
      agent: true,
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
    orderBy: { createdAt: 'asc' },
  })
}

export async function closeInactiveConversations() {
  if (!chatConfig.autoCloseInactiveChats) return []

  const inactiveThreshold = new Date(Date.now() - chatConfig.inactiveTimeout)

  const inactiveConversations = await prisma.conversation.findMany({
    where: {
      status: { not: 'closed' },
      updatedAt: { lt: inactiveThreshold },
    },
  })

  const results = []

  for (const conversation of inactiveConversations) {
    const closed = await prisma.conversation.update({
      where: { id: conversation.id },
      data: {
        status: 'closed',
        closedAt: new Date(),
      },
    })

    results.push(closed)
  }

  return results
}

export default {
  createConversation,
  getConversationsByUser,
  getAllConversations,
  getConversationById,
  updateConversationStatus,
  assignAgentToConversation,
  getConversationsByStatus,
  closeInactiveConversations,
}
