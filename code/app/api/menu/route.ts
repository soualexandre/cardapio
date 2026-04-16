import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'

export async function GET() {
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
    return NextResponse.json(categorias)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erro ao buscar cardápio' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nome, descricao, preco, imagem, categoriaId, ordem } = body

    if (!nome || !preco || !categoriaId) {
      return NextResponse.json({ error: 'Nome, preço e categoria são obrigatórios' }, { status: 400 })
    }

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

    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error(error)

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

    return NextResponse.json({ error: 'Erro ao criar item' }, { status: 500 })
  }
}
