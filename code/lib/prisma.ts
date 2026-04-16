import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

const isProd = process.env.NODE_ENV === 'production'

// Log mais detalhado em produção para facilitar debug
if (isProd) {
  // Não loga credenciais, apenas presença das variáveis importantes
  console.log('[Prisma] Inicializando PrismaClient em produção', {
    nodeEnv: process.env.NODE_ENV,
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    hasDirectUrl: !!process.env.DIRECT_URL,
  })
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: isProd ? ['error', 'warn'] : ['query', 'error', 'warn'],
  })

if (!isProd) {
  globalForPrisma.prisma = prisma
}
