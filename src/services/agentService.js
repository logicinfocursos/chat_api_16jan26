// Serviço de agentes
// Lógica de negócio para gerenciar agentes de suporte

import { getPrismaClient } from '../config/database.js'

const prisma = getPrismaClient()

export async function createAgent(email, name) {
  return await prisma.agent.create({
    data: {
      email,
      name,
      isActive: true,
    },
  })
}

export async function getAgentById(id) {
  return await prisma.agent.findUnique({
    where: { id },
    include: {
      conversations: {
        take: 10,
        orderBy: { updatedAt: 'desc' },
      },
    },
  })
}

export async function getAgentByEmail(email) {
  return await prisma.agent.findUnique({
    where: { email },
  })
}

export async function getAllAgents() {
  return await prisma.agent.findMany({
    include: {
      _count: {
        select: { conversations: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getActiveAgents() {
  return await prisma.agent.findMany({
    where: { isActive: true },
  })
}

export async function updateAgent(id, data) {
  return await prisma.agent.update({
    where: { id },
    data,
  })
}

export async function toggleAgentStatus(id) {
  const agent = await prisma.agent.findUnique({ where: { id } })
  if (!agent) {
    throw new Error('Agente não encontrado')
  }

  return await prisma.agent.update({
    where: { id },
    data: { isActive: !agent.isActive },
  })
}

export async function deleteAgent(id) {
  return await prisma.agent.delete({
    where: { id },
  })
}

export default {
  createAgent,
  getAgentById,
  getAgentByEmail,
  getAllAgents,
  getActiveAgents,
  updateAgent,
  toggleAgentStatus,
  deleteAgent,
}
