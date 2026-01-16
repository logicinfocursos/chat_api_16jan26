// Serviço de usuários
// Lógica de negócio para gerenciar usuários do sistema

import { getPrismaClient } from '../config/database.js'

const prisma = getPrismaClient()

export async function createUser(email, name) {
  return await prisma.user.create({
    data: {
      email,
      name,
    },
  })
}

export async function getUserById(id) {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      conversations: {
        take: 5,
        orderBy: { updatedAt: 'desc' },
      },
    },
  })
}

export async function getUserByEmail(email) {
  return await prisma.user.findUnique({
    where: { email },
  })
}

export async function getAllUsers() {
  return await prisma.user.findMany({
    include: {
      _count: {
        select: { conversations: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function updateUser(id, data) {
  return await prisma.user.update({
    where: { id },
    data,
  })
}

export async function deleteUser(id) {
  return await prisma.user.delete({
    where: { id },
  })
}

export default {
  createUser,
  getUserById,
  getUserByEmail,
  getAllUsers,
  updateUser,
  deleteUser,
}
