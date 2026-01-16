// Serviço de mensagens
// Lógica de negócio para gerenciar mensagens de chat

import { getPrismaClient } from '../config/database.js'
import { getConfig } from '../config/index.js'
import monitorService from './monitorService.js'

const prisma = getPrismaClient()
const chatConfig = getConfig().chat

export async function createMessage(
  conversationId,
  senderType,
  senderId,
  content
) {
  if (content.length > chatConfig.maxMessageLength) {
    throw new Error(
      `Mensagem muito longa. Máximo de ${chatConfig.maxMessageLength} caracteres`
    )
  }

  const message = await prisma.message.create({
    data: {
      conversationId,
      senderType,
      senderId,
      content,
    },
    include: {
      conversation: {
        include: {
          user: true,
          agent: true,
        },
      },
    },
  })

  monitorService.logMessage(message, 'SENT')

  return message
}

export async function getMessagesByConversation(conversationId) {
  return await prisma.message.findMany({
    where: { conversationId },
    include: {
      conversation: {
        select: {
          userId: true,
          agentId: true,
        },
      },
    },
    orderBy: { createdAt: 'asc' },
  })
}

export async function markMessageAsRead(messageId) {
  return await prisma.message.update({
    where: { id: messageId },
    data: { isRead: true },
  })
}

export async function markConversationMessagesAsRead(conversationId, userId) {
  return await prisma.message.updateMany({
    where: {
      conversationId,
      senderId: { not: userId },
      isRead: false,
    },
    data: { isRead: true },
  })
}

export async function getUnreadMessageCount(userId, userType) {
  if (userType === 'user') {
    const conversations = await prisma.conversation.findMany({
      where: { userId },
      select: { id: true },
    })

    return await prisma.message.count({
      where: {
        conversationId: { in: conversations.map((c) => c.id) },
        senderType: 'agent',
        isRead: false,
      },
    })
  } else {
    const conversations = await prisma.conversation.findMany({
      where: { agentId: userId },
      select: { id: true },
    })

    return await prisma.message.count({
      where: {
        conversationId: { in: conversations.map((c) => c.id) },
        senderType: 'user',
        isRead: false,
      },
    })
  }
}

export async function deleteMessage(messageId) {
  return await prisma.message.delete({
    where: { id: messageId },
  })
}

export default {
  createMessage,
  getMessagesByConversation,
  markMessageAsRead,
  markConversationMessagesAsRead,
  getUnreadMessageCount,
  deleteMessage,
}
