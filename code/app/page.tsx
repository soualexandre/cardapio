import { prisma } from '@/lib/prisma'
import CardapioClient from './components/CardapioClient'

async function getCategorias() {
  try {
    console.log('[Home] Buscando categorias do banco de dados...')
    const categorias = await prisma.categoria.findMany({
      include: {
        itens: {
          where: { ativo: true },
          orderBy: { ordem: 'asc' },
        },
      },
      orderBy: { ordem: 'asc' },
    })
    console.log('[Home] Categorias carregadas com sucesso', {
      totalCategorias: categorias.length,
      totalItens: categorias.reduce((acc, cat) => acc + cat.itens.length, 0),
    })
    return categorias
  } catch (error) {
    console.error('[Home] Erro ao buscar cardápio do banco de dados:', error)
    return []
  }
}

export default async function Home() {
  console.log('[Home] Renderizando página inicial')
  const categorias = await getCategorias()
  console.log('[Home] Renderização pronta, enviando dados para o cliente', {
    totalCategorias: categorias.length,
  })
  return <CardapioClient categorias={categorias} />
}
