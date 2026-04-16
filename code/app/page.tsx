import { prisma } from '@/lib/prisma'
import CardapioClient from './components/CardapioClient'

async function getCategorias() {
  try {
    const categorias = await prisma.categoria.findMany({
      include: {
        itens: {
          where: { ativo: true },
          orderBy: { ordem: 'asc' },
        },
      },
      orderBy: { ordem: 'asc' },
    })
    return categorias
  } catch (error) {
    console.error('Erro ao buscar cardápio do banco de dados:', error)
    return []
  }
}

export default async function Home() {
  const categorias = await getCategorias()
  return <CardapioClient categorias={categorias} />
}
