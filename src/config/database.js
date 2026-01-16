// Cliente Prisma Singleton
// Gerencia uma única instância do cliente Prisma para evitar múltiplas conexões

import { PrismaClient } from '@prisma/client'

let prismaInstance = null

export function getPrismaClient() {
  if (!prismaInstance) {
    prismaInstance = new PrismaClient({
      log: ['query', 'error', 'warn'],
    })
  }

  return prismaInstance
}

export async function disconnectPrisma() {
  if (prismaInstance) {
    await prismaInstance.$disconnect()
    prismaInstance = null
  }
}

export default getPrismaClient
