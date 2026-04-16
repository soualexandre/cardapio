import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'

function withCors(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  response.headers.set('Vary', 'Origin')
  return response
}

export async function OPTIONS() {
  return withCors(new NextResponse(null, { status: 204 }))
}

export async function GET() {
  try {
    console.log('[API /api/menu][GET] Buscando categorias...')
    const categorias = await prisma.categoria.findMany({
      include: {
        itens: {
          where: { ativo: true },
          orderBy: { ordem: 'asc' },
        },
      },
      orderBy: { ordem: 'asc' },
    })
    console.log('[API /api/menu][GET] Categorias encontradas', {
      totalCategorias: categorias.length,
      totalItens: categorias.reduce((acc, cat) => acc + cat.itens.length, 0),
    })
    return withCors(NextResponse.json(categorias))
  } catch (error) {
    console.error('[API /api/menu][GET] Erro ao buscar cardápio:', error)
    return withCors(NextResponse.json({ error: 'Erro ao buscar cardápio' }, { status: 500 }))
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('[API /api/menu][POST] Recebendo criação de item...')
    const body = await request.json()
    const { nome, descricao, preco, imagem, categoriaId, ordem } = body

    if (!nome || !preco || !categoriaId) {
      return NextResponse.json({ error: 'Nome, preço e categoria são obrigatórios' }, { status: 400 })
    }

    console.log('[API /api/menu][POST] Dados recebidos', {
      nome,
      categoriaId,
      hasImagem: !!imagem,
      ordem,
    })

    const item = await prisma.menuItem.create({
      data: {
        nome,
        descricao: descricao ?? '',
        preco,
        imagem: imagem ?? '',
        categoriaId,
        ordem: ordem ?? 0,
      },
      include: { categoria: true },
    })

    console.log('[API /api/menu][POST] Item criado com sucesso', {
      id: item.id,
      nome: item.nome,
      categoriaId: item.categoriaId,
    })

    return withCors(NextResponse.json(item, { status: 201 }))
  } catch (error) {
    console.error('[API /api/menu][POST] Erro ao criar item:', error)

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // ID duplicado (sequência fora de sincronia / registro já existe)
      if (error.code === 'P2002' && Array.isArray(error.meta?.target) && error.meta?.target.includes('id')) {
        return NextResponse.json(
          {
            error: 'Já existe um item com esse identificador interno. Tente novamente em alguns segundos ou peça para resetar a sequência da tabela MenuItem.',
            code: 'MENUITEM_ID_CONFLICT',
          },
          { status: 409 },
        )
      }
    }

    return withCors(NextResponse.json({ error: 'Erro ao criar item' }, { status: 500 }))
  }
}
